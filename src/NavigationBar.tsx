import {Anchor, Nav, Text} from 'grommet';
import React from 'react';
import {WrappedComponentProps} from 'react-with-firebase-auth';
import createWithAuth from './auth/createWithAuth';
import Loader from './shared/Loader';
import {Logout} from 'grommet-icons';

function NavigationBar({
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithGoogle,
  signInWithFacebook,
  signInWithGithub,
  signInWithTwitter,
  signInAnonymously,
  signOut,
  setError,
  user,
  error,
  loading,
}: WrappedComponentProps) {
  return (
    <>
      {user && <Text>Welcome {user.displayName}</Text>}
      {user && <Anchor icon={<Logout />} label="Logout" onClick={signOut} />}
    </>
  );
}

export default createWithAuth(NavigationBar);
