import {
  signInAnonymously,
  ApplicationVerifier,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
  Auth,
  signInWithPopup,
  ConfirmationResult,
  UserCredential,
  AuthError,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {useState} from 'react';

type SignInPromise = Promise<UserCredential | AuthError>;

export type FirebaseAuthProviders = {
  signInWithGoogle: () => SignInPromise;
  signInWithFacebook: () => SignInPromise;
  signInWithGithub: () => SignInPromise;
  signInWithTwitter: () => SignInPromise;
  signInAnonymously: () => void;
  signInWithEmailAndPassword: (email: string, password: string) => void;
  signInWithPhoneNumber: (
    phoneNumber: string,
    applicationVerifier: ApplicationVerifier
  ) => void;
  signOut: () => void;
  createUserWithEmailAndPassword: (email: string, password: string) => void;
  error?: string;
  loading: boolean;
};

export type AuthProviderKey = keyof AuthProviders;

export type AuthProviders = {
  googleProvider?: GoogleAuthProvider;
  facebookProvider?: FacebookAuthProvider;
  twitterProvider?: TwitterAuthProvider;
  githubProvider?: GithubAuthProvider;
};

export function useAuthProviders(
  auth: Auth,
  providers: AuthProviders
): FirebaseAuthProviders {
  let [loading, setLoading] = useState<boolean>(false);
  let [error, setError] = useState<string>(null);
  return {
    signInWithGithub: () => {
      return tryToSignInWithProvider('githubProvider');
    },
    signInWithTwitter: () => {
      return tryToSignInWithProvider('twitterProvider');
    },
    signInWithGoogle: () => {
      return tryToSignInWithProvider('googleProvider');
    },
    signInWithFacebook: () => {
      return tryToSignInWithProvider('facebookProvider');
    },
    signInAnonymously: () => {
      tryTo<UserCredential>(() => signInAnonymously(auth));
    },
    signInWithEmailAndPassword: (email: string, password: string) => {
      tryTo<UserCredential>(() =>
        signInWithEmailAndPassword(auth, email, password)
      );
    },
    signInWithPhoneNumber: (
      phoneNumber: string,
      applicationVerifier: ApplicationVerifier
    ) => {
      tryTo<ConfirmationResult>(() =>
        signInWithPhoneNumber(auth, phoneNumber, applicationVerifier)
      );
    },
    signOut: () => {
      tryTo<void>(() => auth.signOut());
    },
    createUserWithEmailAndPassword: (email: string, password: string) => {
      tryTo<UserCredential>(() =>
        createUserWithEmailAndPassword(auth, email, password)
      );
    },
    loading,
    error,
  };

  async function tryTo<T>(operation: () => Promise<T>) {
    try {
      setLoading(true);
      const result = await operation();
      return result;
    } catch (error) {
      setError(error.message);
      return error as AuthError;
    } finally {
      setLoading(false);
    }
  }

  function tryToSignInWithProvider(provider: AuthProviderKey) {
    return tryTo<UserCredential>(() => {
      const providerInstance = providers[provider];

      if (!providerInstance) {
        throw new Error(`auth is not configured with ${provider}`);
      }

      return signInWithPopup(auth, providerInstance);
    });
  }
}
