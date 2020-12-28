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

export function useQueryPromise<T>(
  config: {
    key: string;
    event: firebase.database.EventType; 
    cb: firebaseOnCallback<any>;
  }[],
  construct: (parts: any[]) => T
) {
  let [error, setError] = useState<any>(null);
  let [loading, setLoading] = useState(true);
  let [data, setData] = useState<T>(null);

  useEffect(() => {
    let tables = config.map(({key, event, cb}) => {
      let ref = rootRef.ref(key);
      return {
        ref,
        promise: databaseListenify(ref, event, cb),
      };
    });

    Promise.all(tables.map((t) => t.promise))
      .then(construct)
      .then(setData)
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });

    return () => {
      tables.forEach((t) => t.ref.off());
    };
  }, []);

  return {
    error,
    loading,
    data,
  };
}

export type firebaseOnCallback<T> = (
  a: firebase.database.DataSnapshot,
  b?: string | null
) => T;

/**
 * wrapper for attaching listeners to the firebase database
 * @param ref any firebase database reference
 * @param event the event to subscribe to
 * @param cb callback for the subscribed event
 * @param onError callback for errors
 * @returns unsubcribe handler
 */
export function databaseListener(
  ref: firebase.database.Reference,
  event: firebase.database.EventType,
  cb: firebaseOnCallback<any>,
  onError?: (error: Error) => void
): () => void {
  let callbackReference = ref.on(event, cb, (e) => {
    if (e && onError) onError(e);
  });

  return () => ref.off(event, callbackReference);
}

export function databaseListenify<T>(
  ref: firebase.database.Reference,
  event: firebase.database.EventType,
  cb: firebaseOnCallback<T>
): Promise<T> {
  return new Promise<T>((res, rej) => {
    databaseListener(
      ref,
      event,
      (s, b) => {
        res(cb(s, b));
      },
      rej
    );
  });
}
