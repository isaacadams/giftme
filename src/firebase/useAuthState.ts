import React, {useEffect, useState} from 'react';

export type FirebaseAuthState = {
  initializing: boolean;
  isAuthenticated: boolean;
  user?: firebase.User | null;
  error?: string;
};

export function useAuthState(auth: firebase.auth.Auth): FirebaseAuthState {
  let [user, setUser] = useState<firebase.User>(null);
  let [initializing, setInitializing] = useState<boolean>(true);
  let [error, setError] = useState<string>(null);
  useEffect(() => {
    let unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setInitializing(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    user,
    initializing,
    isAuthenticated: !initializing && !!user,
    error,
  };
}
