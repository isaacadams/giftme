import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import {FirebaseAuthState, useAuthState} from './useAuthState';
import useAuthProviders, {FirebaseAuthProviders} from './useAuthProviders';
import {apiKey, projectId} from './fbConfig.json';

/// it is safe to expose the apiKey used here
/// https://stackoverflow.com/questions/37482366/is-it-safe-to-expose-firebase-apikey-to-the-public
export const config = createConfig(apiKey, projectId);

function createConfig(ak, pid) {
  return {
    apiKey: ak,
    authDomain: `${pid}.firebaseapp.com`,
    databaseURL: `https://${pid}.firebaseio.com`,
    storageBucket: `${pid}.appspot.com`,
  };
}

firebase.initializeApp(config);

export type FirebaseApp = {
  app: firebase.app.App;
  auth: firebase.auth.Auth;
  database: firebase.database.Database;
  authProviders: FirebaseAuthProviders;
  authState: FirebaseAuthState;
};

export function useFirebaseApp(): FirebaseApp {
  let app = firebase.app();
  let auth = app.auth();
  let authState = useAuthState(auth);

  return {
    app,
    database: app.database(),
    auth,
    authProviders: useAuthProviders({
      auth,
      providers: {
        googleProvider: new firebase.auth.GoogleAuthProvider(),
      },
      user: authState.user,
    }),
    authState,
  };
}
