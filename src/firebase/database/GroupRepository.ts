import {Repository} from './Repository';
import FirebaseApp from '../FirebaseApp';

export class GroupModel {
  name: string;
  displayName?: string;
  members?: string[];
  inviteLink?: string;
}

export class GroupRepository extends Repository<GroupModel> {
  constructor(database: firebase.database.Database) {
    super(database.ref('groups'), null);
  }
}

export class UserGroupRepository {
  user: firebase.User;
  constructor(user: firebase.User) {
    if (!user) {
      console.error('failed to create repo');
      return;
    }
    this.user = user;
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

  async addGroup(name: string, displayName: string, members: string[] = []) {
    name = name.trim().toLowerCase();
    displayName = displayName.trim();

    let rootRef = FirebaseApp.database();
    let {key} = rootRef.ref(`groups`).push({name, displayName});

    let routes = [this.user.uid, ...members].reduce((p, uid) => {
      p[`groups/${key}/members/${uid}`] = true;
      p[`users/${uid}/groups/${key}`] = true;
      return p;
    }, {});

    routes[`groupnames/${name}`] = key;

    rootRef.ref().update(routes);
  }

  getUserGroups(cb: (groups: GroupModel[]) => void): () => void {
    if (!this.user) {
      console.error('no user');
      return;
    }

    let rootRef = FirebaseApp.database();
    let usersRef = rootRef.ref('users');
    let groupsRef = rootRef.ref('groups');

    usersRef
      .child(this.user.uid)
      .once('value')
      .then((s) => s.val())
      .then((user) => {
        if (!user || user['groups']?.length < 1)
          return Promise.reject('no groups assigned');
        let {groups} = user;
        let groupKeys = Object.keys(groups);
        return Promise.all(groupKeys.map(getGroup)).then(cb);
      })
      .catch(console.error);

    return () => {
      usersRef.off();
      groupsRef.off();
    };

    function getGroup(gKey): Promise<GroupModel> {
      return groupsRef
        .child(gKey)
        .once('value')
        .then((d) => d.val());
    }
  }
}
