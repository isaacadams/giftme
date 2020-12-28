import {FirebaseAppContext, UserModel} from '@firebase';
import { Loader } from '@shared';
import {Box, Heading, Text} from 'grommet';
import React, { useContext, useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import {Wishlist, WishlistView} from './WishlistPage';

interface IUrlParams {
  uid: string;
}

export function ProfilePage(props) {
  let {uid} = useParams<IUrlParams>();
  let {userRepo} = useContext(FirebaseAppContext).repos;
  let [user, setUser] = useState(null);
  useEffect(() => {
    userRepo.getUser(setUser);
  }, []);

  if(!uid || !user) return <Loader />;

  return <ProfileView user={user} uid={uid} />;
}

interface IProps {
  uid: string;
  user: UserModel;
}
export function ProfileView({user, uid}: IProps) {
  return (
    <Box direction='row' fill justify='center' gap='medium'>
      <Box
        responsive
        align="start"
        gap="small"
        margin={{bottom: 'medium'}}
      >
        <Heading size={'30'} margin={'0'}>
          {user.displayName}
        </Heading>
        <Text>@{user.name}</Text>
      </Box>
      <Box margin={{top: 'medium'}}>
        <Wishlist uid={uid} />
      </Box>
    </Box>
  );
}