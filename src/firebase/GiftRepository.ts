import {Repository} from './database/Repository';
import '@isaacadams/extensions';

export class Gift {
  name: string;
  link?: string;
  description?: string;
  image?: string;
  claimed?: {
    by: string;
    date: Date;
  };
}

export class GiftRepository extends Repository<Gift> {
  constructor(database: firebase.database.Database, user: firebase.User) {
    super(database.ref(`gifts/${user.uid}`), [
      (data) => {
        if (!stringIsValid(data?.name))
          return Promise.reject(
            `attempted to submit without a name:\n${JSON.stringify(
              data,
              null,
              2
            )}`
          );

        return Promise.resolve();
      },
    ]);
  }
}

let stringIsValid = (s: string) => s && !s.isNullOrWhitespace();