import {Repository} from './Repository';
import FirebaseApp from '../FirebaseApp';
import {User, UserRepository} from './UserRepository';

export class GroupModel {
  name: string;
  displayName: string;
  members?: string[];
  inviteLink?: string;
}

export class GroupRepository extends Repository<GroupModel> {
  constructor(database: firebase.database.Database) {
    super(database.ref('groups'), null);
  }
}

export class UserGroupRepository {
  groupRepo: GroupRepository;
  userRepo: UserRepository;
  user: firebase.User;
  constructor(user: firebase.User) {
    if (!user) {
      console.error('failed to create repo');
      return;
    }

    let db = FirebaseApp.database();
    this.user = user;
    this.groupRepo = new GroupRepository(db);
    this.userRepo = new UserRepository(db);
  }

  async addGroup(name: string, displayName: string, members: string[] = []) {
    let {key} = await this.groupRepo.create({name, displayName});

    let routes = [this.user.uid, ...members].reduce((p, uid) => {
      p[`groups/${key}/members/${uid}`] = true;
      p[`users/${uid}/groups/${key}`] = true;
      return p;
    }, {});

    this.groupRepo.table.root.update(routes);
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
      .then(({groups}) => {
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
