import {FirebaseAppContext} from '#firebase';
import {UserModel, GiftModel, useQuery} from '#database';
import {Loader} from '#shared';
import {Box, Heading, Text} from 'grommet';
import React, {useContext} from 'react';
import {Redirect, useHistory, useParams} from 'react-router-dom';
import {WishlistView} from './WishlistPage';

interface IUrlParams {
  username: string;
}

interface IProfile {
  user: UserModel;
  gifts: GiftModel[];
}

export function ProfilePage(props) {
  let {username} = useParams<IUrlParams>();
  let {usernamesTable, loading} = useContext(FirebaseAppContext).usernamesHook;
  if (loading) return <Loader />;

  let uid: string = usernamesTable[username];

  if (!uid) {
    console.log(`no userid for @${username}`);
    return <Redirect to="/" />;
  }

  return <Profile uid={uid} />;
}

export function Profile({uid}) {
  let {data, loading} = useQuery<IProfile>(
    [
      {
        key: `users/${uid}`,
        event: 'value',
        cb: (s) => s.val(),
      },
      {
        key: `gifts/${uid}`,
        event: 'value',
        cb: (s) => Object.values(s.val() ?? {}),
      },
    ],
    ([user, gifts]) => ({user, gifts})
  );

  if (loading || !data) return <Loader />;
  return <ProfileView {...data} />;
}

export function ProfileView({user, gifts}: IProfile) {
  if (!user) {
    console.error('user is undefined!');
    return <Loader />;
  }
  return (
    <Box direction="row" fill justify="center" gap="medium">
      <Box responsive align="start" gap="small" margin={{bottom: 'medium'}}>
        <Heading size={'30'} margin={'0'}>
          {user.displayName}
        </Heading>
        <Text>@{user.username}</Text>
      </Box>
      <Box margin={{top: 'medium'}}>
        <WishlistView gifts={gifts} name="My" />
      </Box>
    </Box>
  );
}
