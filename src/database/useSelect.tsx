import firebase from 'firebase';
import FirebaseApp from '@config';
import {useState, useEffect} from 'react';

const rootRef = FirebaseApp.database();
export function useSelect<T>(refName: string) {
  let [data, setData] = useState<T>(null);

  useEffect(() => {
    let ref = rootRef.ref(refName);
    let cb = (s) => {
      setData(s.val());
    };
    ref.once('value', cb);
    return () => {
      ref.off('value', cb);
    };
  }, []);

  return data;
}
