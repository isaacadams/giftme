import {Repository} from './Repository';
import FirebaseApp from '../FirebaseApp';
import {UserRepository} from './UserRepository';

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
  constructor() {
    let db = FirebaseApp.database();
    this.user = FirebaseApp.auth().currentUser;
    FirebaseApp.auth().onAuthStateChanged((u) => (this.user = u));
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
}
