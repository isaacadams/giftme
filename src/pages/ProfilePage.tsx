import {UserModel, GiftModel, useQuery} from '@firebase';
import {Loader} from '@shared';
import {Box, Heading, Text} from 'grommet';
import React from 'react';
import {useParams} from 'react-router-dom';
import {WishlistView} from './WishlistPage';

interface IUrlParams {
  uid: string;
}

interface IProfile {
  user: UserModel;
  gifts: GiftModel[];
}

export function ProfilePage(props) {
  let {uid} = useParams<IUrlParams>();

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

  if (!uid || loading || !data) return <Loader />;

  return <ProfileView {...data} />;
}

export function ProfileView({user, gifts}: IProfile) {
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
