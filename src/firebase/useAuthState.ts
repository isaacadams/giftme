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
  let [loading, setLoading] = useState<boolean>(true);
  let [error, setError] = useState<firebase.auth.Error>(null);

  let history = useHistory();

  useEffect(() => {
    let unsubscribe = auth.onAuthStateChanged((u) => {
      if (!u) {
        setUser(null);
      } else {
        setUser(u);
        new UserRepository(u)
          .ensureUserExistsAndIsValid()
          .then(({valid, userModel}) => {
            setUserModel(userModel);
            if (!valid) history.push('/profile/update');
          });
      }

      setLoading(false);
    }, setError);
    return () => {
      setLoading(true);
      unsubscribe();
    };
  }, []);

  return {
    user,
    userModel,
    loading,
    isAuthenticated: !loading && !!user,
    error,
  };
}
