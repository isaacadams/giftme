import FirebaseApp from '#config';
import {useContext, useEffect, useRef, useState} from 'react';
import {databaseListener, DatabaseModel} from '#database';
import {FirebaseAppContext} from './FirebaseAppProvider';

export interface IUsernamesHook {
  usernamesTable: DatabaseModel['usernames'];
  loading: boolean;
  usernames: string[];
  uids: string[];
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
      FirebaseApp.database().ref('usernames'),
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
      usernamesTable: {},
      usernames: [],
      uids: [],
    };
  }

  return {
    loading,
    usernamesTable: usernamesTable.current,
    usernames: Object.keys(usernamesTable.current),
    uids: Object.values(usernamesTable.current),
  };
}
