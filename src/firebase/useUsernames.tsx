import FirebaseApp from '@config';
import {useEffect, useState} from 'react';
import {databaseListener} from '@database';

export interface IUsernamesHook {
  usernames: any;
  loading: boolean;
}

export function useUsernames(): IUsernamesHook {
  let [usernames, setUsernames] = useState<string[]>([]);
  let [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsub = databaseListener(
      FirebaseApp.database().ref('usernames'),
      'value',
      (s) => {
        setUsernames(s.val());
        setLoading(false);
      }
    );
    return () => {
      unsub();
    };
  }, []);

  return {
    loading,
    usernames,
  };
}
