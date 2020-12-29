import firebase from 'firebase';
import FirebaseApp from '../FirebaseApp';
import {useState, useEffect} from 'react';

const rootRef = FirebaseApp.database();

export function useQuery<T>(
  config: {
    key: string;
    event: firebase.database.EventType;
    cb: firebaseOnCallback<any>;
  }[],
  construct: (parts: any[]) => T
) {
  let [error, setError] = useState<any>(null);
  let [loading, setLoading] = useState(true);
  let [feed, setFeed] = useState<any[]>([]);

  useEffect(() => {
    let tables = config.map(({key, event, cb}, i) => {
      let ref = rootRef.ref(key);
      let promise = databaseListenify(ref, event, (s, b) => {
        console.log('feed changing...');
        console.log(feed);
        setFeed((v) => {
          v[i] = cb(s, b);
          return [...v];
        });
        console.log(feed);
      });
      return {
        ref,
        promise,
      };
    });

    Promise.all(tables.map((t) => t.promise))
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
    data: construct(feed),
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
