import * as React from 'react';
import {Google} from 'grommet-icons';
import {Box, Button, Grid, Heading} from 'grommet';
import {Loader} from '@shared';
import {useContext} from 'react';
import {FirebaseAppContext} from '.';

export function SignInPage(props) {
  let {signInWithGoogle, loading} = useContext(
    FirebaseAppContext
  ).authProviders;
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
