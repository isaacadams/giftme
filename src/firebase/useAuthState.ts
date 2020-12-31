import firebase from 'firebase';
import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {UserModel, UserRepository} from '@database';

export type FirebaseAuthState = {
  loading: boolean;
  isAuthenticated: boolean;
  user?: firebase.User | null;
  userModel: UserModel;
  error?: firebase.auth.Error;
};

export function useAuthState(auth: firebase.auth.Auth): FirebaseAuthState {
  let [user, setUser] = useState<firebase.User>(null);
  let [userModel, setUserModel] = useState<UserModel>(null);
  let [loadingUser, setLoadingUser] = useState<boolean>(true);
  let [loadingUserModel, setLoadingUserModel] = useState<boolean>(true);
  let [error, setError] = useState<firebase.auth.Error>(null);

  let history = useHistory();

  useEffect(() => {
    let unsubscribe = auth.onAuthStateChanged((u) => {
      if (!u) {
        setUser(null);
      } else {
        setUser(u);
      }
      setLoadingUser(false);
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
        if (!valid) history.push('/profile/update');
        console.log(userModel);
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
  };
}
