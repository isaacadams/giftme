import {Repository} from './Repository';
import FirebaseApp from '../FirebaseApp';

export class GroupModelForm {
  name: string;
  displayName?: string;
}

export class GroupModel extends GroupModelForm {
  owner: string;
  members?: string[];
  inviteLink?: string;
}

export class GroupRepository extends Repository<GroupModel> {
  constructor(database: firebase.database.Database) {
    super(database.ref('groups'), null);
  }
}

export class UserGroupRepository {
  constructor() {}

  getIsGroupnameValid(): Promise<{
    groupnames: string[];
    isValid: (name: string) => boolean;
  }> {
    return FirebaseApp.database()
      .ref(`groupnames`)
      .once('value')
      .then((s) => {
        let groupnames = Object.keys(s.val() ?? []);
        return {
          groupnames,
          isValid: (name) => !groupnames.includes(name),
        };
      });
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
    cb: (groups: GroupModel[]) => void
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
      let newUserGroup = s.val();
      if (!newUserGroup) return;

      Promise.all(Object.keys(newUserGroup).map(getGroup)).then(cb);
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
