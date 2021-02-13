import * as React from 'react';
import {Google} from 'grommet-icons';
import {Box, Button, Grid, Heading} from 'grommet';
import FirebaseApp from '@config';
import {useAuthProviders} from '@firebase';
import firebase from 'firebase';

const auth = FirebaseApp.auth();

export function SignInPage(props) {
  let {signInWithGoogle, loading} = useAuthProviders(auth, {
    googleProvider: new firebase.auth.GoogleAuthProvider(),
  });

  return (
    <Grid align="center" alignContent="around" fill="vertical">
      <Box gap="small">
        <Heading size={'30'} textAlign="center">
          Sign In
        </Heading>
        <Button
          label={'Sign in with Google'}
          icon={<Google />}
          onClick={signInWithGoogle}
          color="dark"
        />
      </Box>
    </Grid>
  );
}
