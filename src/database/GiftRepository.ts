import {Repository} from './Repository';
import '@isaacadams/extensions';
import {FirebaseApp, FirebaseDatabase} from '#/config';
import {ref} from 'firebase/database';

export class GiftModel {
  name: string;
  link?: string;
  description?: string;
  image?: string;
  claimed?: {
    by: string;
    date: Date;
  };
}

export class GiftRepository extends Repository<GiftModel> {
  constructor(uid: string) {
    super(ref(FirebaseDatabase, `gifts/${uid}`), [
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
