import {FirebaseAuthState, useAuthState} from './useAuthState';
import {FirebaseAuthProviders, useAuthProviders} from './useAuthProviders';
import {FirebaseApp, FirebaseAuth} from '#/config';
import * as React from 'react';
import {Loader} from '#/shared';
import {Box} from 'grommet';
import {getRepositories, Repositories} from '#/database';
import {GoogleAuthProvider} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';

export type FirebaseAppModel = {
  authProviders: FirebaseAuthProviders;
  repos: Repositories;
};

export const FirebaseAppContext = React.createContext<FirebaseAppModel | null>(
  null
);

export function FirebaseAppProvider({children}: React.PropsWithChildren<any>) {
  let authProviders = useAuthProviders(FirebaseAuth, {
    googleProvider: new GoogleAuthProvider(),
  });
  let {user, loading, failedToLoad} = React.useContext(AuthStateContext);

  let navigate = useNavigate();

  React.useEffect(() => {
    if (failedToLoad) {
      navigate('/login');
    }
  }, [failedToLoad]);

  return (
    <FirebaseAppContext.Provider
      value={{
        authProviders,
        repos: getRepositories(user),
      }}
    >
      {loading && (
        <Box fill align="center" justify="center">
          <Loader />
        </Box>
      )}
      {user && children}
    </FirebaseAppContext.Provider>
  );
}

export const AuthStateContext = React.createContext<FirebaseAuthState>(null);

export function AuthStateProvider({children}) {
  let {user, loading, failedToLoad, isAuthenticated, userModel, error} =
    useAuthState(FirebaseAuth);

  return (
    <AuthStateContext.Provider
      value={{user, loading, failedToLoad, isAuthenticated, userModel, error}}
    >
      {children}
    </AuthStateContext.Provider>
  );
}
