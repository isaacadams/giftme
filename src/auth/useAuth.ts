import React, {useContext, useEffect, useState} from 'react';
import {getFirebaseApp} from '../FirebaseApp';

export function useAuth(): {
  user: firebase.User;
  loading: boolean;
  error: string;
} {
  let {auth} = getFirebaseApp();

  let [user, setUser] = useState<firebase.User>(auth.currentUser);
  let [loading, setLoading] = useState<boolean>(undefined);
  let [error, setError] = useState<string>(undefined);

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
