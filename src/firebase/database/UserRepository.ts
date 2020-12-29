import firebase from 'firebase';
import FirebaseApp from '../FirebaseApp';
import {UserNameValidation} from './validation';

const rootRef = FirebaseApp.database();

export class UserModel {
  displayName: string;
  username: string;
  email: string;
  phoneNumber: string;
  groups?: string[];
}

export class UserRepository {
  user: firebase.User;
  constructor(user: firebase.User) {
    this.user = user;
  }

  ensureUserExistsAndIsValid(): Promise<boolean> {
    return rootRef
      .ref(`users/${this.user.uid}`)
      .once('value')
      .then((s) => {
        let user = s.val();
        if (user) {
          //if user exists but does not have a username then user will be redirected to a form to make one
          return !!user?.username;
        }
        let {displayName, email, phoneNumber} = this.user;
        s.ref.update({displayName, email, phoneNumber});
        return false;
      });
  }

  getUser(cb: (d: UserModel) => void): () => void {
    let usersRef = rootRef.ref(`users/${this.user.uid}`);

    usersRef.on('value', (s) => {
      cb(s.val());
    });

    return () => {
      usersRef.off();
    };
  }

  addUsername(name: string): void {
    name = name.trim().toLowerCase();
    let validation = new UserNameValidation();
    let errors = [validation.length(name), validation.urlSafe(name)].filter(
      (e) => !!e
    );
    if (errors.length > 0) {
      console.error(errors);
      return;
    }

    let userid = this.user.uid;
    let usernamesRef = rootRef.ref('usernames');

    rootRef
      .ref(`users/${userid}/username`)
      .get()
      .then((s) => {
        let oldUsername = s.val();
        return () => {
          if (oldUsername) {
            console.log(`removing old username: ${oldUsername}`);
            usernamesRef.child(oldUsername).remove();
          }
        };
      })
      .then((removeOldUsername) => {
        return rootRef
          .ref()
          .update({
            [`users/${userid}/username`]: name,
            [`usernames/${name}`]: userid,
          })
          .then((v) => {
            removeOldUsername();
            /* usernamesRef.transaction(usernames => {
              Object.keys(usernames).filter(k => k !== name && usernames[k] === userid).forEach(k => delete usernames[k]);
              console.log("updating valid usernames");
              console.log(usernames);
              return usernames;
            }); */
          });
      })
      .catch(console.error);
  }
}
