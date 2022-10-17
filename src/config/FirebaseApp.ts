import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getDatabase} from 'firebase/database';

/// it is safe to expose the apiKey used here
/// https://stackoverflow.com/questions/37482366/is-it-safe-to-expose-firebase-apikey-to-the-public
export const config = createConfig(process.env.API_KEY, process.env.PROJECT_ID);
console.log(config);
function createConfig(apiKey, projectId) {
  return {
    apiKey,
    authDomain: `${projectId}.firebaseapp.com`,
    databaseURL: `https://giftme-8e917-default-rtdb.firebaseio.com`,
    storageBucket: `${projectId}.appspot.com`,
  };
}

export const app = initializeApp(config);
export const auth = getAuth(app);
export const database = getDatabase(app);
