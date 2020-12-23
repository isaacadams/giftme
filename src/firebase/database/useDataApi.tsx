import React, {useEffect} from 'react';
import {IRepository} from './Repository';

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

export function useDataApi<T>(repo: IRepository<T>): IDataService<T> {
  // initialize our default state
  let [error, setError] = React.useState<Error>(null);
  let [loading, setLoading] = React.useState(true);
  let [feed, setFeed] = React.useState<any>(null);

  useEffect(() => {
    if (!repo) return;

    repo.getAll().once(
      'value',
      (snapShot) => {
        let data = snapShot.val();
        setFeed(data);
        setLoading(false);
      },
      (e) => setError(e)
    );

    return () => repo.table.off();
  }, [repo]);

  return {
    error,
    loading,
    items: transformToList<T>(feed).map(({primaryKey, value}) => ({
      primaryKey,
      value,
      update: (d: T) => {
        repo.update(primaryKey, d);
        feed[primaryKey] = d;
        setFeed({...feed});
      },
      remove: () => {
        repo.remove(primaryKey);
        delete feed[primaryKey];
        setFeed({...feed});
      },
    })),
    add: async (d: T) => {
      let ref = await repo.create(d);
      feed[ref.key] = d;
      setFeed({...feed});
      return ref.key;
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
