import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import {AuthProviders} from './auth/useAuthProviders';
import {apiKey, projectId} from './fbConfig.json';

/// it is safe to expose the apiKey used here
/// https://stackoverflow.com/questions/37482366/is-it-safe-to-expose-firebase-apikey-to-the-public
export const config = createConfig(apiKey, projectId);

firebase.initializeApp(config);

export function createConfig(ak, pid) {
  return {
    apiKey: ak,
    authDomain: `${pid}.firebaseapp.com`,
    databaseURL: `https://${pid}.firebaseio.com`,
    storageBucket: `${pid}.appspot.com`,
  };
}

export type FirebaseApp = {
  app: firebase.app.App;
  auth: firebase.auth.Auth;
  database: firebase.database.Database;
  providers?: AuthProviders;
};

export function getFirebaseApp(): FirebaseApp {
  let app = firebase.app();

  return {
    app,
    auth: app.auth(),
    database: app.database(),
    providers: {
      googleProvider: new firebase.auth.GoogleAuthProvider(),
    },
  };
}
