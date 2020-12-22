import {Nav, Text} from 'grommet';
import React from 'react';
import { WrappedComponentProps } from 'react-with-firebase-auth';
import createWithAuth from './auth/createWithAuth';
import Loader from './shared/Loader';

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
    <Nav direction="row" align="center" responsive>
      {/* <Link to={r.GetPathToRoute()} key={i}>
      <Anchor icon={<r.view.icon />} label={r.name} as="div" />
    </Link> */}
      {user && <Text>Welcome {user.displayName}</Text>}
    </Nav>
  );
}

export default createWithAuth(NavigationBar);
