import {Anchor, Text} from 'grommet';
import React from 'react';
import {Logout} from 'grommet-icons';
import useAuthProviders from './auth/useAuthProviders';

function NavigationBar(props) {
  let {signOut, user} = useAuthProviders();
  return (
    <>
      {user && <Text>Welcome {user.displayName}</Text>}
      {user && <Anchor icon={<Logout />} label="Logout" onClick={signOut} />}
    </>
  );
}

export default NavigationBar;
