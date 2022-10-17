import {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {UserModel, UserRepository} from '#/database';
import {Auth, User} from 'firebase/auth';

export type FirebaseAuthState = {
  loading: boolean;
  isAuthenticated: boolean;
  user?: User | null;
  userModel: UserModel;
  error?: Error;
  failedToLoad: boolean;
};

export function useAuthState(auth: Auth): FirebaseAuthState {
  let [user, setUser] = useState<User>(null);
  let [userModel, setUserModel] = useState<UserModel>(null);
  let [loadingUser, setLoadingUser] = useState<boolean>(true);
  let [failedToLoadUser, setFailedToLoaderUser] = useState<boolean>(false);
  let [loadingUserModel, setLoadingUserModel] = useState<boolean>(true);
  let [error, setError] = useState<Error>(null);

  let history = useHistory();

  useEffect(() => {
    let unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoadingUser(false);
      setFailedToLoaderUser(!u);
    }, setError);

    return () => {
      setLoadingUser(true);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let unsubscribe = new UserRepository(user).ensureUserExistsAndIsValid(
      (valid, userModel) => {
        setUserModel(userModel);
        setLoadingUserModel(false);

        if (user && !valid) {
          history.push('/profile/update');
        }
      }
    );

    return () => {
      setLoadingUser(true);
      unsubscribe();
    };
  }, [user]);

  let loading = loadingUser || loadingUserModel;

  return {
    user,
    userModel,
    loading,
    isAuthenticated: !loading && !!user,
    error,
    failedToLoad: failedToLoadUser,
  };
}
