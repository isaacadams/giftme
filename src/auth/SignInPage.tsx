import * as React from 'react';
import {WrappedComponentProps} from 'react-with-firebase-auth';
import {Google} from 'grommet-icons';
import {Box, Button, ButtonProps, Grid, Heading} from 'grommet';
import createWithAuth from './createWithAuth';
import Loader from '../shared/Loader';

function ShowLogin({signIn}) {
  return (
    <Layout
      header={`Log in`}
      button={{
        label: 'Sign in with Google',
        icon: <Google />,
      }}
      onClick={signIn}
    />
  );
}

function ShowLogout({name, signOut}) {
  return (
    <Layout
      header={`Hello, ${name}`}
      button={{
        label: 'Sign Out',
      }}
      onClick={signOut}
    />
  );
}

interface IProps {
  header: string;
  button: ButtonProps;
  onClick: any;
}

function Layout({header, button, onClick}: IProps) {
  return (
    <Grid align="center">
      <Heading size={'30'}>{header}</Heading>
      <Button {...button} onClick={onClick} color='dark' />
    </Grid>
  );
}

function SignInPage({
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
  if (loading) return <Loader />;

  return (
    <Box align="center" fill>
      {user ? (
        <ShowLogout name={user.displayName} signOut={signOut} />
      ) : (
        <ShowLogin signIn={signInWithGoogle} />
      )}
    </Box>
  );
}

export default createWithAuth(SignInPage);
