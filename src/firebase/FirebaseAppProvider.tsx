import firebase from 'firebase/app';
import {FirebaseAuthState, useAuthState} from './useAuthState';
import CreateAuthProviders, {
  FirebaseAuthProviders,
} from './CreateAuthProviders';
import FirebaseApp from './FirebaseApp';
import React from 'react';
import {Loader} from '@shared';
import {Box} from 'grommet';
import {getRepositories, Repositories} from './database';

export type FirebaseAppModel = {
  authProviders: FirebaseAuthProviders;
  authState: FirebaseAuthState;
  repos: Repositories;
};

const auth = FirebaseApp.auth();

const authProviders = CreateAuthProviders(auth, {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
});

export const FirebaseAppContext = React.createContext<FirebaseAppModel | null>(
  null
);

export function FirebaseAppProvider({children}: React.PropsWithChildren<any>) {
  let authState = useAuthState(auth);
  let {user, loading} = authState;

  return (
    <FirebaseAppContext.Provider
      value={{
        authProviders,
        authState,
        repos: getRepositories(user),
      }}
    >
      {loading && (
        <Box fill align="center" justify="center">
          <Loader />
        </Box>
      )}
      {!loading && children}
    </FirebaseAppContext.Provider>
  );
}
