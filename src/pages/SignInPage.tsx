import * as React from 'react';
import {Google} from 'grommet-icons';
import {Box, Button, Grid, Heading} from 'grommet';
import {FirebaseAuth} from '#/config';
import {GoogleAuthProvider} from 'firebase/auth';
import {useAuthProviders} from '#/firebase';

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
          onClick={() => {
            signInWithGoogle().then(console.info).catch(console.error);
          }}
          color="dark"
        />
      </Box>
    </Grid>
  );
}
