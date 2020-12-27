import FirebaseApp from '../FirebaseApp';

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
  members?: string[];
  inviteLink?: string;
}

export class UserGroupRepository {
  constructor() {}

  getIsGroupnameValid(cb: (groupnames: GroupNamesModel) => void): () => void {
    let groupNamesRef = FirebaseApp.database().ref(`groupnames`);
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

  getGroupByName(name: string): Promise<GroupModel> {
    let rootRef = FirebaseApp.database();
    return rootRef
      .ref(`groupnames/${name}`)
      .once('value')
      .then((s) => s.val())
      .then((k) => {
        return rootRef
          .ref(`groups/${k}`)
          .once('value')
          .then((s) => s.val());
      });
  }

  addGroup(
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

    FirebaseApp.database()
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
    userid: string,
    cb: (groups: GroupModel[]) => void,
    complete?: () => void
  ): () => void {
    if (!userid) {
      console.error('no userid');
      return;
    }

    let rootRef = FirebaseApp.database();
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
