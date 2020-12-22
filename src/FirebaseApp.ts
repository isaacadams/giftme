import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
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

export function getFirebaseApp() {
  let app = firebase.app();

  return {
    app,
    auth: app.auth(),
    database: app.database(),
  };
}
