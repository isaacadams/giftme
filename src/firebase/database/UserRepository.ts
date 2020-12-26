import {Repository} from './Repository';

export class User {
  username?: string;
  groups?: string[];
}

export class UserRepository extends Repository<User> {
  constructor(database: firebase.database.Database) {
    super(database.ref('users'), null);
  }
}
