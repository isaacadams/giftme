import * as firebase from 'firebase/app';
import {FirebaseAuthState, useAuthState} from './useAuthState';
import useAuthProviders, {FirebaseAuthProviders} from './useAuthProviders';
import FirebaseApp from './FirebaseApp';
import React from 'react';
import {Loader} from '@shared';
import {Box} from 'grommet';

export type FirebaseAppModel = {
  app: firebase.app.App;
  auth: firebase.auth.Auth;
  database: firebase.database.Database;
  authProviders: FirebaseAuthProviders;
  authState: FirebaseAuthState;
};

export const FirebaseAppContext = React.createContext<FirebaseAppModel | null>(
  null
);

export function FirebaseAppProvider({children}: React.PropsWithChildren<any>) {
  let auth = FirebaseApp.auth();
  let authState = useAuthState(auth);
  let {error} = authState;

  if (error) return <Box>ERROR: {error.message}</Box>;

  return (
    <FirebaseAppContext.Provider
      value={{
        app: FirebaseApp,
        database: FirebaseApp.database(),
        auth,
        authProviders: useAuthProviders({
          auth,
          providers: {
            googleProvider: new firebase.auth.GoogleAuthProvider(),
          },
          user: authState.user,
        }),
        authState,
      }}
    >
      {children}
    </FirebaseAppContext.Provider>
  );
}
