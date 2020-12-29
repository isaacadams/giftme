import {GroupModel} from '@firebase';
import {Wishlist} from '../WishlistPage';
import {Box, Heading, Text} from 'grommet';
import * as React from 'react';
import {InviteToGroup} from './InviteToGroup';
import {EditGroupButton} from './EditGroupButton';

interface IGroupWishlistPageProps {
  group: GroupModel;
}

export function GroupWishlistPage({group}: IGroupWishlistPageProps) {
  return (
    <>
      <Box
        responsive
        fill="horizontal"
        align="start"
        gap="small"
        margin={{bottom: 'medium'}}
      >
        <Heading size={'30'} margin={'0'}>
          {group.displayName}
        </Heading>
        <Text>@{group.name}</Text>
        <EditGroupButton {...{onEditButtonClick}} />
        <InviteToGroup />
      </Box>
      <Box responsive>
        <GroupWishlist users={Object.keys(group.members)} />
      </Box>
    </>
  );

  function onEditButtonClick() {
    console.log('clicked edit');
  }
}

interface IProps {
  users: string[];
}

export function GroupWishlist({users}: IProps) {
  return (
    <Box>{users && users.map((u, i) => <Wishlist key={i} uid={u} />)}</Box>
  );
}
