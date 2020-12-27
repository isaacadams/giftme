import React, {useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
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

  useEffect(() => {
    let unsubscribe = auth.onAuthStateChanged((u) => {
      setLoading(false);
      if (!u) {
        setUser(null);
        return;
      }

      setUser(u);
      new UserRepository(u).ensureUserExists();
    }, setError);
    return () => {
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
