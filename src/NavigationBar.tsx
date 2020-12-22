import {Anchor, Avatar, Box, Text} from 'grommet';
import React, {useContext} from 'react';
import {Logout, User} from 'grommet-icons';
import {FirebaseAppContext} from '@firebase';

function NavigationBar(props) {
  let {signOut, user} = useContext(FirebaseAppContext).authProviders;
  if (!user) return <></>;
  console.log(user.photoURL);
  return (
    <>
      <Box direction="row" gap="small" align='center'>
        <ShowAvatar photoUrl={user.photoURL} />
        <Text>{user.displayName}</Text>
      </Box>
      <Anchor icon={<Logout />} label="Logout" onClick={signOut} />
    </>
  );
}

function ShowAvatar({photoUrl}) {
  /* if(photoUrl) return <Avatar src={photoUrl} onError={console.log} />; */

  return (
    <Avatar background="accent-1">
      <User color="dark-1" />
    </Avatar>
  );
}

export default NavigationBar;
