import firebase from 'firebase';
import FirebaseApp from '@config';

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
  cb: (group: GroupModel) => void
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
      cb(group);
    });
  });

  return () => {
    refs.forEach((r) => r.off());
  };
}

export class UserGroupRepository {
  userid: string;
  constructor(user: firebase.User) {
    this.userid = user.uid;
  }

  getIsGroupnameValid(cb: (groupnames: GroupNamesModel) => void): () => void {
    let groupNamesRef = rootRef.ref(`groupnames`);
    groupNamesRef.on('value', (s) => {
      let groupnames = Object.keys(s.val() ?? {});
      cb({
        groupnames,
        isValid: (name) => !groupnames.includes(name),
      });
    });

    return () => {
      groupNamesRef.off();
    };
  }

  addGroup(name: string, displayName: string, members: string[] = []): void {
    let userid = this.userid;
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

  getUserGroups(
    cb: (groups: GroupModel[]) => void,
    complete?: () => void
  ): () => void {
    let userid = this.userid;
    if (!userid) {
      console.error('no userid');
      return;
    }
    let refs: firebase.database.Reference[] = [];

    let usersRef = rootRef.ref(`users/${userid}/groups`);
    refs.push(usersRef);

    usersRef.on('value', (s) => {
      let userGroups: string[] = Object.keys(s.val() ?? {});

      Promise.all(userGroups.map(getGroup))
        .then(cb)
        .finally(complete)
        .catch(console.error);
      console.log('adding another group');
    });

    return () => {
      refs.forEach((r) => r.off());
    };

    function getGroup(gKey: string): Promise<GroupModel> {
      return rootRef
        .ref(`groups/${gKey}`)
        .once('value')
        .then((s) => s.val());
    }
  }
}
