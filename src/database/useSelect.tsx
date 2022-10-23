import {FirebaseApp, FirebaseDatabase} from '#/config';
import {useState, useEffect} from 'react';
import {ref, get} from 'firebase/database';

export function useSelect<T>(refName: string) {
  let [data, setData] = useState<T>(null);

  useEffect(() => {
    let tableRef = ref(FirebaseDatabase, refName);
    let cb = (s) => {
      setData(s.val());
    };
    get(tableRef).then(cb);
    return () => {};
  }, []);

  return data;
}
