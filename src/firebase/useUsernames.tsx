import {FirebaseApp, FirebaseDatabase} from '#/config';
import {useContext, useEffect, useRef, useState} from 'react';
import {databaseListener, DatabaseModel} from '#/database';
import {FirebaseAppContext} from './FirebaseAppProvider';
import {ref} from 'firebase/database';

export interface IUsernamesHook {
  loading: boolean;
  usernames: string[];
  uids: string[];
  getUid(username: string): string;
}

export function useUsernames({}): IUsernamesHook {
  let usernamesTable = useRef<DatabaseModel['usernames']>({});
  let [loading, setLoading] = useState<boolean>(true);
  let {isAuthenticated} = useContext(FirebaseAppContext).authState;
  console.log('usernames hook rendering.');

  useEffect(() => {
    console.log('usernames loading.');
    if (!isAuthenticated) return;
    let unsub = databaseListener(
      ref(FirebaseDatabase, 'usernames'),
      'value',
      (s) => {
        usernamesTable.current = s.val();
      },
      console.error,
      () => {
        console.log('usernames completed.');
        setLoading(false);
      }
    );
    return () => {
      unsub();
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    console.info('cannot access usernames unless authenticated');
    return {
      loading: false,
      usernames: [],
      uids: [],
      getUid,
    };
  }

  return {
    loading,
    usernames: Object.keys(usernamesTable.current),
    uids: Object.values(usernamesTable.current),
    getUid,
  };

  function getUid(username: string): string {
    return usernamesTable.current[username];
  }
}
