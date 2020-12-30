import * as React from 'react';
import {Google} from 'grommet-icons';
import {Box, Button, Grid, Heading} from 'grommet';
import {Loader} from '@shared';
import {useContext} from 'react';
import {FirebaseAppContext} from '@firebase';

export function SignInPage(props) {
  let {signInWithGoogle, loading} = useContext(
    FirebaseAppContext
  ).authProviders;
  if (loading) return <Loader />;

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
