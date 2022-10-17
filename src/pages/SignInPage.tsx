import * as React from 'react';
import {Google} from 'grommet-icons';
import {Box, Button, Grid, Heading} from 'grommet';
import {FirebaseApp, FirebaseAuth} from '#/config';
import {useAuthProviders} from '#/firebase';
import {GoogleAuthProvider} from 'firebase/auth';

export function SignInPage(props) {
  const auth = FirebaseAuth;
  let {signInWithGoogle, loading} = useAuthProviders(auth, {
    googleProvider: new GoogleAuthProvider(),
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
