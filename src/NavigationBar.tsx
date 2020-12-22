import {Anchor, Text} from 'grommet';
import React, {useContext} from 'react';
import {Logout} from 'grommet-icons';
import {FirebaseAppContext} from '@firebase';

function NavigationBar(props) {
  let {signOut, user} = useContext(FirebaseAppContext).authProviders;
  return (
    <>
      {user && <Text>Welcome {user.displayName}</Text>}
      {user && <Anchor icon={<Logout />} label="Logout" onClick={signOut} />}
    </>
  );
}

export default NavigationBar;
