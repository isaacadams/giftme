import {useState} from 'react';
import {getFirebaseApp} from '../FirebaseApp';
import {useAuth} from './useAuth';

export type FirebaseAuthAPI = {
  signInWithGoogle: () => void;
  signInWithFacebook: () => void;
  signInWithGithub: () => void;
  signInWithTwitter: () => void;
  signInAnonymously: () => void;
  signInWithEmailAndPassword: (email: string, password: string) => void;
  signInWithPhoneNumber: (
    phoneNumber: string,
    applicationVerifier: firebase.auth.ApplicationVerifier
  ) => void;
  signOut: () => void;
  createUserWithEmailAndPassword: (email: string, password: string) => void;
  /* setError: (error: string) => void;*/
  user?: firebase.User | null;
  error?: string;
  loading: boolean;
};

export type AuthProviderKey = keyof AuthProviders;

export type AuthProviders = {
  googleProvider?: firebase.auth.GoogleAuthProvider;
  facebookProvider?: firebase.auth.FacebookAuthProvider;
  twitterProvider?: firebase.auth.TwitterAuthProvider;
  githubProvider?: firebase.auth.GithubAuthProvider;
};

export type AuthSetupParameters = {
  firebaseAppAuth: firebase.auth.Auth;
  providers?: AuthProviders;
};

export default function useAuthProviders(): FirebaseAuthAPI {
  let {auth, providers} = getFirebaseApp();
  let [loading, setLoading] = useState<boolean>(false);
  let [error, setError] = useState<string>(null);
  let {user} = useAuth();
  return {
    signInWithGithub: () => {
      tryToSignInWithProvider('githubProvider');
    },
    signInWithTwitter: () => {
      tryToSignInWithProvider('twitterProvider');
    },
    signInWithGoogle: () => {
      tryToSignInWithProvider('googleProvider');
    },
    signInWithFacebook: () => {
      tryToSignInWithProvider('facebookProvider');
    },
    signInAnonymously: () => {
      tryTo<firebase.auth.UserCredential>(() => auth.signInAnonymously());
    },
    signInWithEmailAndPassword: (email: string, password: string) => {
      tryTo<firebase.auth.UserCredential>(() =>
        auth.signInWithEmailAndPassword(email, password)
      );
    },
    signInWithPhoneNumber: (
      phoneNumber: string,
      applicationVerifier: firebase.auth.ApplicationVerifier
    ) => {
      tryTo<firebase.auth.ConfirmationResult>(() =>
        auth.signInWithPhoneNumber(phoneNumber, applicationVerifier)
      );
    },
    signOut: () => {
      tryTo<void>(() => auth.signOut());
    },
    createUserWithEmailAndPassword: (email: string, password: string) => {
      tryTo<firebase.auth.UserCredential>(() =>
        auth.createUserWithEmailAndPassword(email, password)
      );
    },
    loading,
    error,
    user,
  };

  async function tryTo<T>(operation: () => Promise<T>) {
    try {
      setLoading(true);
      const result = await operation();
      return result;
    } catch (error) {
      setError(error.message);
      return error as firebase.auth.Error;
    } finally {
      setLoading(false);
    }
  }

  function tryToSignInWithProvider(provider: AuthProviderKey) {
    return tryTo<firebase.auth.UserCredential>(() => {
      const providerInstance = providers[provider];

      if (!providerInstance) {
        throw new Error(`auth is not configured with ${provider}`);
      }

      return auth.signInWithPopup(providerInstance);
    });
  }
}
