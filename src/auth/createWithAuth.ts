import withFirebaseAuth from 'react-with-firebase-auth';
import 'firebase/auth';
import * as fb from 'firebase/app';
import {getFirebaseApp} from '../FirebaseApp';

let {auth} = getFirebaseApp();
export default withFirebaseAuth({
  providers: {
    googleProvider: new fb.auth.GoogleAuthProvider(),
  },
  firebaseAppAuth: auth,
});
