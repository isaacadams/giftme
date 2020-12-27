import firebase from 'firebase';
import FirebaseApp from '../FirebaseApp';

const rootRef = FirebaseApp.database();

export class User {
  username?: string;
  groups?: string[];
}

export class UserRepository {
  user: firebase.User;
  constructor(user: firebase.User) {
    this.user = user;
  }

  ensureUserExists(): void {
    rootRef
      .ref(`users/${this.user.uid}`)
      .once('value')
      .then((s) => {
        if (s.val()) {
          return;
        }
        let {displayName, email, phoneNumber} = this.user;
        s.ref.update({displayName, email, phoneNumber});
      });
  }
}
