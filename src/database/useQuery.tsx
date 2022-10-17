import {
  child,
  DatabaseReference,
  DataSnapshot,
  EventType,
  ref,
  onChildAdded,
  onChildChanged,
  onChildMoved,
  onChildRemoved,
  onValue,
  query,
} from 'firebase/database';
import {FirebaseApp, FirebaseDatabase} from '#/config';
import {useState, useEffect} from 'react';

const rootRef = () => FirebaseDatabase;

export function useQuery<T>(
  config: {
    key: string;
    event: EventType;
    cb: firebaseOnCallback<any>;
  }[],
  construct: (parts: any[]) => T
) {
  let [errors, setError] = useState<Error[]>([]);
  let [loading, setLoading] = useState<boolean[]>([]);
  let [feed, setFeed] = useState<any[]>([]);

  useEffect(() => {
    let unsubscriptions = config.map(({key, event, cb}, i) =>
      databaseListener(
        child(ref(FirebaseDatabase), key),
        event,
        (s, b) => {
          setFeed((v) => {
            v[i] = cb(s, b);
            return [...v];
          });
        },
        (err) => {
          setError((e) => {
            e[i] = err;
            return [...e];
          });
        },
        () => {
          setLoading((b) => {
            b[i] = false;
            return [...b];
          });
        }
      )
    );

    return () => {
      unsubscriptions.forEach((unsub) => unsub());
    };
  }, []);

  return {
    error: !errors || errors.some((e) => !!e) ? errors : undefined,
    loading:
      !(
        loading.length === config.length &&
        loading.every((load) => load === false)
      ) ?? true,
    data: construct(feed),
  };
}

export type firebaseOnCallback<T> = (a: DataSnapshot, b?: string | null) => T;

/**
 * wrapper for attaching listeners to the firebase database
 * @param ref any firebase database reference
 * @param event the event to subscribe to
 * @param cb callback for the subscribed event
 * @param onError callback for errors
 * @param onComplete callback for completion
 * @returns unsubcribe handler
 */
export function databaseListener(
  ref: DatabaseReference,
  event: EventType,
  cb: firebaseOnCallback<any>,
  onError?: (error: Error) => void,
  onComplete?: () => void
): () => void {
  //'value' | 'child_added' | 'child_changed' | 'child_moved' | 'child_removed'
  const eventcb = {
    ['value']: onValue,
    ['child_added']: onChildAdded,
    ['child_changed']: onChildChanged,
    ['child_moved']: onChildMoved,
    ['child_removed']: onChildRemoved,
  }[event];
  let unsub = eventcb(
    ref,
    (s) => {
      cb(s);
      if (onComplete) onComplete();
    },
    (e) => {
      if (e && onError) onError(e);
    }
  );

  return () => unsub();
}

export function databaseListenify<T>(
  ref: DatabaseReference,
  event: EventType,
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
