import FirebaseApp from '@config';
import {useEffect, useState} from 'react';
import {databaseListener, DatabaseModel} from '@database';

export interface IUsernamesHook {
  usernamesTable: DatabaseModel['usernames'];
  loading: boolean;
  usernames: string[];
  uids: string[];
}

export function useUsernames(): IUsernamesHook {
  let [usernamesTable, setUsernames] = useState<DatabaseModel['usernames']>({});
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
    usernamesTable,
    usernames: Object.keys(usernamesTable),
    uids: Object.values(usernamesTable),
  };
}
