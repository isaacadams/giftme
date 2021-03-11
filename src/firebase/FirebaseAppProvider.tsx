import firebase from 'firebase/app';
import {FirebaseAuthState, useAuthState} from './useAuthState';
import {FirebaseAuthProviders, useAuthProviders} from './useAuthProviders';
import FirebaseApp from '#config';
import React from 'react';
import {Loader} from '#shared';
import {Box} from 'grommet';
import {getRepositories, Repositories} from '#database';
import {IUsernamesHook, useUsernames} from './useUsernames';
import {SignInPage} from '#pages';
import {Sign} from 'grommet-icons';

export type FirebaseAppModel = {
  authProviders: FirebaseAuthProviders;
  authState: FirebaseAuthState;
  repos: Repositories;
  usernamesHook: IUsernamesHook;
};

const auth = FirebaseApp.auth();

export const FirebaseAppContext = React.createContext<FirebaseAppModel | null>(
  null
);

export function FirebaseAppProvider({children}: React.PropsWithChildren<any>) {
  let authProviders = useAuthProviders(auth, {
    googleProvider: new firebase.auth.GoogleAuthProvider(),
  });
  let authState = useAuthState(auth);
  let {user, loading, failedToLoad} = authState;
  let usernamesHook = useUsernames();

  return (
    <FirebaseAppContext.Provider
      value={{
        authProviders,
        authState,
        repos: getRepositories(user),
        usernamesHook,
      }}
    >
      {loading && (
        <Box fill align="center" justify="center">
          {!failedToLoad && <Loader />}
          {failedToLoad && <SignInPage />}
        </Box>
      )}
      {!loading && children}
    </FirebaseAppContext.Provider>
  );
}
