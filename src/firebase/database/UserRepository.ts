import {Repository} from './Repository';
import FirebaseApp from '../FirebaseApp';

const rootRef =  FirebaseApp.database();

export class User {
  username?: string;
  groups?: string[];
}

export class UserRepository {
  constructor() {
  }

  ensureUserExists(user: firebase.User): void {
    rootRef.ref(`users/${user.uid}`).once('value').then(s => {
      if(s.val()) {
        console.log('user already exists');
        return;
      }
      let {displayName, email, phoneNumber} = user;
      s.ref.update({displayName, email, phoneNumber});
    });
  }
}
