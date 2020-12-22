import React from 'react';
import {FirebaseApp} from './useFirebaseApp';

export * from './useFirebaseApp';
export const FirebaseAppContext = React.createContext<FirebaseApp | null>(null);
