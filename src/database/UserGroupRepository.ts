import {FirebaseApp, FirebaseDatabase} from '#/config';
import {
  child,
  DatabaseReference,
  get,
  onValue,
  push,
  ref,
  remove,
  update,
} from 'firebase/database';
import {TableKeyWithItem} from './schema';

const rootRef = () => ref(FirebaseDatabase);

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
  let groupsnamesRef = ref(FirebaseDatabase, `groupnames/${name}`);

  get(groupsnamesRef).then((s) => {
    let groupKey = s.val();
    let groupsRef = ref(FirebaseDatabase, `groups/${groupKey}`);

    get(groupsRef).then((s) => {
      let group: GroupModel = s.val();
      cb(group, groupKey);
    });
  });

  return () => {};
}

export function deleteGroup(
  groupkey: string,
  groupname: string,
  group: GroupModel
) {
  remove(ref(FirebaseDatabase, `groupnames/${groupname}`));
  remove(ref(FirebaseDatabase, `groups/${groupkey}`));

  let usersRef = ref(FirebaseDatabase, 'users');
  Object.keys(group.members).forEach((k) => {
    remove(child(child(usersRef, k), `groups/${groupkey}`));
  });
}

export function getIsGroupnameValid(
  cb: (groupnames: GroupNamesModel) => void
): () => void {
  let groupNamesRef = ref(FirebaseDatabase, 'groupnames');
  let unsub = onValue(groupNamesRef, (s) => {
    let groupnames = Object.keys(s.val() ?? {});
    cb({
      groupnames,
      isValid: (name) => !groupnames.includes(name),
    });
  });

  return () => {
    unsub();
  };
}

export function addUserToGroup(userid: string, groupid: string) {
  update(ref(FirebaseDatabase), {
    [`groups/${groupid}/members/${userid}`]: true,
    [`users/${userid}/groups/${groupid}`]: true,
  });
}

export function deleteUserFromGroup(userid: string, groupid: string) {
  remove(ref(FirebaseDatabase, `groups/${groupid}/members/${userid}`));
  remove(ref(FirebaseDatabase, `users/${userid}/groups/${groupid}`));
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

  push(ref(FirebaseDatabase, `groups`), data)
    .then(({key, root}) => {
      let routes = [userid, ...members].reduce((p, uid) => {
        p[`groups/${key}/members/${uid}`] = true;
        p[`users/${uid}/groups/${key}`] = true;
        return p;
      }, {});
      routes[`groupnames/${name}`] = key;

      return update(root, routes);
    })
    .catch(console.error);
}

export function getUserGroups(
  userid: string,
  shouldContinue: boolean,
  cb: (groups: TableKeyWithItem<GroupModel>[]) => void,
  complete?: () => void
): () => void {
  if (!userid) {
    console.error('no userid');
    return;
  }
  let usersRef = ref(FirebaseDatabase, `users/${userid}/groups`);

  let unsub = onValue(usersRef, (s) => {
    let userGroups: string[] = Object.keys(s.val() ?? {});
    Promise.all(userGroups.map(getGroup))
      .then((d) => shouldContinue && cb(d))
      .catch((e) => shouldContinue && console.error(e))
      .finally(() => shouldContinue && complete());

    console.log('adding another group');
  });

  return () => {
    unsub();
  };
}

export function getGroup(gKey: string): Promise<TableKeyWithItem<GroupModel>> {
  return get(ref(FirebaseDatabase, `groups/${gKey}`)).then((s) => ({
    key: gKey,
    ...s.val(),
  }));
}
