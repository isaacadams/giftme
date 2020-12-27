import FirebaseApp from '../FirebaseApp';
import React, {useEffect} from 'react';

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

const rootRef = FirebaseApp.database();

export function useData<T>(key: string): IDataService<T> {
  let [error, setError] = React.useState<Error>(null);
  let [loading, setLoading] = React.useState(true);
  let [feed, setFeed] = React.useState<any>(null);

  let ref = rootRef.ref(key);

  useEffect(() => {
    ref.on('value', (s) => {
      setFeed(s.val());
      setLoading(false);
    });

    return () => {
      ref.off();
    };
  }, [ref]);

  return {
    error,
    loading,
    items: transformToList<T>(feed).map(({primaryKey, value}) => ({
      primaryKey,
      value,
      update: (d: T) => {
        return new Promise<void>((res, rej) => {
          ref.child(primaryKey).update(d, (e) => {
            if (e) rej(e);
            res();
          });
        });
      },
      remove: () => {
        return new Promise<void>((res, rej) => {
          ref.child(primaryKey).remove((e) => {
            if (e) rej(e);
            res();
          });
        });
      },
    })),
    add: (d: T) => {
      return ref
        .push(
          d,
          (e) =>
            new Promise<void>((res, rej) => {
              if (e) rej(e);
              res();
            })
        )
        .then((r) => {
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
