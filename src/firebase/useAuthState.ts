import firebase from 'firebase';
import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {UserRepository} from './database/UserRepository';

export type FirebaseAuthState = {
  loading: boolean;
  isAuthenticated: boolean;
  user?: firebase.User | null;
  error?: firebase.auth.Error;
};

export function useAuthState(auth: firebase.auth.Auth): FirebaseAuthState {
  let [user, setUser] = useState<firebase.User>(null);
  let [loading, setLoading] = useState<boolean>(true);
  let [error, setError] = useState<firebase.auth.Error>(null);

  let history = useHistory();

  useEffect(() => {
    let unsubscribe = auth.onAuthStateChanged((u) => {
      if (!u) {
        setUser(null);
      } else {
        setUser(u);
        new UserRepository(u).ensureUserExistsAndIsValid().then((valid) => {
          if (valid) return;
          history.push('/profile/update');
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
    loading,
    isAuthenticated: !loading && !!user,
    error,
  };
}
