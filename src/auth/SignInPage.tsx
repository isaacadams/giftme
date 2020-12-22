import * as React from 'react';
import {WrappedComponentProps} from 'react-with-firebase-auth';
import {Google} from 'grommet-icons';
import {Box, Button, Grid, Heading} from 'grommet';
import createWithAuth from './createWithAuth';
import Loader from '../shared/Loader';

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
    <Box>
      <Grid align="center" fill>
        <Heading size={'30'}>Sign In</Heading>
        <Button
          label={'Sign in with Google'}
          icon={<Google />}
          onClick={signInWithGoogle}
          color="dark"
        />
      </Grid>
    </Box>
  );
}

export default createWithAuth(SignInPage);
