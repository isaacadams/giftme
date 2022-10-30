import {FirebaseApp, FirebaseDatabase} from '#/config';
import {UserNameValidation} from './validation';
import {Table} from '#/database';
import {EmailLike} from '#/shared';
import {
  ref,
  query as fbQuery,
  get,
  orderByChild,
  startAt,
  endAt,
  onValue,
  update,
  remove,
  child,
} from 'firebase/database';
import {User} from 'firebase/auth';

const rootRef = () => FirebaseDatabase;

export function getUser(userid: string, cb: (d: UserModel) => void): void {
  get(ref(FirebaseDatabase, `users/${userid}`)).then((s) => cb(s.val()));
}

export function searchUsers(
  query: string,
  cb: (users: Table<UserModel>) => void
) {
  let queryingOnUsername = query.startsWith('@');
  if (queryingOnUsername && query.length === 1) return;
  if (queryingOnUsername) query = query.slice(1, query.length);

  let childKey: string = queryingOnUsername ? 'username' : 'displayName';

  const usersRef = ref(FirebaseDatabase, 'users');

  get(
    fbQuery(
      usersRef,
      orderByChild(childKey),
      startAt(query.toUpperCase()),
      endAt(query.toLowerCase() + '\uf8ff')
    )
  ).then((s) => cb(s.val()));
}

export class UserModel {
  displayName: string;
  username: string;
  email: EmailLike;
  phoneNumber: string;
  groups?: string[];
}

export class UserRepository {
  user: User;
  usernames: string[];
  constructor(user: User) {
    this.user = user;
  }

  ensureUserExistsAndIsValid(
    cb: (valid: boolean, userModel: UserModel) => void
  ): () => void {
    if (!this.user) {
      console.error('user was null');
      return () => {};
    }
    let usersRef = ref(FirebaseDatabase, `users/${this.user.uid}`);

    let unsubscribe = onValue(usersRef, (s) => {
      let user = s.val();
      if (!user) {
        let {displayName, email, phoneNumber} = this.user;
        update(s.ref, {displayName, email, phoneNumber});
      }

      //if user exists but does not have a username then user will be redirected to a form to make one
      /* {
          valid: !!user?.username,
          userModel: user
        } */
      cb(!!user?.username, user);
    });

    return () => {
      unsubscribe();
    };
  }

  getUser(cb: (d: UserModel) => void): () => void {
    let usersRef = ref(FirebaseDatabase, `users/${this.user.uid}`);

    let unsub = onValue(usersRef, (s) => cb(s.val()));

    return () => {
      unsub();
    };
  }

  addUsername(name: string): Promise<void> {
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
    let usernamesRef = ref(FirebaseDatabase, 'usernames');

    return get(ref(FirebaseDatabase, `users/${userid}/username`))
      .then((s) => {
        let oldUsername = s.val();
        return () => {
          if (oldUsername) {
            console.log(`removing old username: ${oldUsername}`);
            remove(child(usernamesRef, oldUsername));
          }
        };
      })
      .then((removeOldUsername) => {
        return update(ref(FirebaseDatabase), {
          [`users/${userid}/username`]: name,
          [`usernames/${name}`]: userid,
        }).then((v) => {
          removeOldUsername();
          /* usernamesRef.transaction(usernames => {
              Object.keys(usernames).filter(k => k !== name && usernames[k] === userid).forEach(k => delete usernames[k]);
              console.log("updating valid usernames");
              console.log(usernames);
              return usernames;
            }); */
        });
      });
  }
}
