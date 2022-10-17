import {FirebaseApp, FirebaseDatabase} from '#/config';
import {useEffect, useState} from 'react';
import {
  ref,
  onValue,
  off,
  child,
  push,
  update,
  remove,
} from 'firebase/database';

export interface IDataWithKey<T> {
  primaryKey: string;
  value: T;
}

export interface IDataItems<T> {
  primaryKey: string;
  value: T;
  update: (data: T) => void;
  remove: () => void;
}

export interface IDataService<T> {
  error: Error;
  loading: boolean;
  items: IDataItems<T>[];
  add: (d: T) => Promise<string>;
}

export function useData<T extends object>(key: string): IDataService<T> {
  let [error, setError] = useState<Error>(null);
  let [loading, setLoading] = useState(true);
  let [feed, setFeed] = useState<any>(null);

  let dref = ref(FirebaseDatabase, key);

  useEffect(() => {
    const unsub = onValue(dref, (s) => {
      setFeed(s.val());
      setLoading(false);
    });

    return () => {
      unsub();
      //off(valueQuery, 'value');
    };
  }, [ref]);

  return {
    error,
    loading,
    items: transformToList<T>(feed).map(({primaryKey, value}) => {
      const table = child(ref(FirebaseDatabase), primaryKey);

      return {
        primaryKey,
        value,
        update: (d: T) => {
          return update(table, d);
        },
        remove: () => {
          return remove(table);
        },
      };
    }),
    add: (d: T) => {
      return push(dref, d).then((r) => {
        return r.key;
      });
    },
  };
}

function transformToList<T>(data: any): IDataWithKey<T>[] {
  if (!data) return [];
  return Object.keys(data).map((primaryKey) => ({
    primaryKey,
    value: data[primaryKey],
  }));
}
