import firebase from 'firebase';
import FirebaseApp from '@config';
import {TableKeyWithItem} from './schema';

const rootRef = FirebaseApp.database();

export type GroupNamesModel = {
  groupnames: string[];
  isValid: (name: string) => boolean;
};

export class GroupModelForm {
  name: string;
  displayName?: string;
}

export class GroupModel extends GroupModelForm {
  owner: string;
  members?: {[key: string]: boolean};
  inviteLink?: string;
}

export function getGroupByName(
  name: string,
  cb: (group: GroupModel, groupKey: string) => void
): () => void {
  let refs: firebase.database.Reference[] = [];
  let groupsnamesRef = rootRef.ref(`groupnames/${name}`);
  refs.push(groupsnamesRef);

  groupsnamesRef.once('value').then((s) => {
    let groupKey = s.val();
    let groupsRef = rootRef.ref(`groups/${groupKey}`);
    refs.push(groupsRef);

    groupsRef.on('value', (s) => {
      let group: GroupModel = s.val();
      cb(group, groupKey);
    });
  });

  return () => {
    refs.forEach((r) => r.off());
  };
}

export function deleteGroup(
  groupkey: string,
  groupname: string,
  group: GroupModel
) {
  rootRef.ref(`groupnames/${groupname}`).remove();
  rootRef.ref(`groups/${groupkey}`).remove();
  let usersRef = rootRef.ref('users');
  Object.keys(group.members).forEach((k) => {
    usersRef.child(k).child(`groups/${groupkey}`).remove();
  });
}

export function getIsGroupnameValid(
  cb: (groupnames: GroupNamesModel) => void
): () => void {
  let groupNamesRef = rootRef.ref(`groupnames`);
  let cbOff = groupNamesRef.on('value', (s) => {
    let groupnames = Object.keys(s.val() ?? {});
    cb({
      groupnames,
      isValid: (name) => !groupnames.includes(name),
    });
  });

  return () => {
    groupNamesRef.off('value', cbOff);
  };
}

export function addGroup(
  userid: string,
  name: string,
  displayName: string,
  members: string[] = []
): void {
  if (!userid) {
    console.error('no userid');
    return;
  }
  name = name.trim().toLowerCase();
  displayName = displayName?.trim();

  let data: GroupModel = {name, owner: userid};
  if (displayName) data.displayName = displayName;

  rootRef
    .ref(`groups`)
    .push(data)
    .then(({key, root}) => {
      let routes = [userid, ...members].reduce((p, uid) => {
        p[`groups/${key}/members/${uid}`] = true;
        p[`users/${uid}/groups/${key}`] = true;
        return p;
      }, {});
      routes[`groupnames/${name}`] = key;
      return root.update(routes);
    })
    .catch(console.error);
}

export function getUserGroups(
  userid: string,
  cb: (groups: TableKeyWithItem<GroupModel>[]) => void,
  complete?: () => void
): () => void {
  if (!userid) {
    console.error('no userid');
    return;
  }
  let usersRef = rootRef.ref(`users/${userid}/groups`);

  let usersRefCb = usersRef.on('value', (s) => {
    let userGroups: string[] = Object.keys(s.val() ?? {});

    Promise.all(userGroups.map(getGroup))
      .then(cb)
      .finally(complete)
      .catch(console.error);
    console.log('adding another group');
  });

  return () => {
    usersRef.off('value', usersRefCb);
  };
}

export function getGroup(gKey: string): Promise<TableKeyWithItem<GroupModel>> {
  return rootRef
    .ref(`groups/${gKey}`)
    .once('value')
    .then((s) => ({
      key: gKey,
      ...s.val(),
    }));
}
