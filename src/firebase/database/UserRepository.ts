import {Repository} from './Repository';

export class User {
  username?: string;
  family_ids?: string[];
}

export class UserRepository extends Repository<User> {
  constructor(database: firebase.database.Database) {
    super(database.ref('user'), null);
  }
}
