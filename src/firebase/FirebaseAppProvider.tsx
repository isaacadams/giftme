import {FirebaseAuthState, useAuthState} from './useAuthState';
import {FirebaseAuthProviders, useAuthProviders} from './useAuthProviders';
import {FirebaseApp, FirebaseAuth} from '#/config';
import * as React from 'react';
import {Loader} from '#/shared';
import {Box} from 'grommet';
import {getRepositories, Repositories} from '#/database';
import {SignInPage} from '#/pages';
import {Sign} from 'grommet-icons';
import {GoogleAuthProvider} from 'firebase/auth';

export type FirebaseAppModel = {
  authProviders: FirebaseAuthProviders;
  authState: FirebaseAuthState;
  repos: Repositories;
};

export const FirebaseAppContext = React.createContext<FirebaseAppModel | null>(
  null
);

export function FirebaseAppProvider({children}: React.PropsWithChildren<any>) {
  let authProviders = useAuthProviders(FirebaseAuth, {
    googleProvider: new GoogleAuthProvider(),
  });
  let {user, loading, failedToLoad, isAuthenticated, userModel, error} =
    useAuthState(FirebaseAuth);

  return (
    <FirebaseAppContext.Provider
      value={{
        authProviders,
        authState: {
          user,
          loading,
          failedToLoad,
          isAuthenticated,
          userModel,
          error,
        },
        repos: getRepositories(user),
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
