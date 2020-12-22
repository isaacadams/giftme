import React, {useContext, useEffect, useState} from 'react';
import {getFirebaseApp} from '../FirebaseApp';

export type FirebaseAuthState = {
  loading: boolean;
  user?: firebase.User | null;
  error?: string;
};

export function useAuth(): FirebaseAuthState {
  let {auth} = getFirebaseApp();

  let [user, setUser] = useState<firebase.User>(auth.currentUser);

  let [loading, setLoading] = useState<boolean>(false);
  let [error, setError] = useState<string>(null);

  useEffect(() => {
    let unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    error,
  };
}
