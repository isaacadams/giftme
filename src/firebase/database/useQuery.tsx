import firebase from 'firebase';
import FirebaseApp from '../FirebaseApp';
import {useState, useEffect} from 'react';

const rootRef = FirebaseApp.database();

export function useQuery<T>(
  databaseKeys: string[],
  query: (tableRefs: firebase.database.Reference[]) => Promise<T>
) {
  let [error, setError] = useState<any>(null);
  let [loading, setLoading] = useState(true);
  let [data, setData] = useState<T>(null);

  useEffect(() => {
    let refs = databaseKeys.map((k) => rootRef.ref(k));

    query(refs)
      .then(setData)
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });

    return () => {
      refs.forEach((r) => r.off());
    };
  }, []);

  return {
    error,
    loading,
    data,
  };
}
