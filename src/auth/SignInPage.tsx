import * as React from 'react';
import {Google} from 'grommet-icons';
import {Box, Button, Grid, Heading} from 'grommet';
import Loader from '../shared/Loader';
import useAuthProviders from './useAuthProviders';

function SignInPage(props) {
  let {signInWithGoogle, loading} = useAuthProviders();
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

export default SignInPage;
