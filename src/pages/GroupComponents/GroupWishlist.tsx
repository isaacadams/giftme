import {GroupModel} from '@firebase/database';
import {Wishlist} from '../WishlistPage';
import {Box, Heading, Text} from 'grommet';
import * as React from 'react';
import {InviteToGroup} from './InviteToGroup';
import {EditGroupButton} from './EditGroupButton';
import {EditGroupPage} from './EditGroupPage';

interface IGroupWishlistPageProps {
  group: GroupModel;
}

export function GroupWishlistPage({group}: IGroupWishlistPageProps) {
  let [editing, setEditing] = React.useState(false);

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
        {editing && <EditGroupPage {...{group, groupname: ''}} />}
        {!editing && <GroupWishlist users={Object.keys(group.members)} />}
      </Box>
    </>
  );

  function onEditButtonClick() {
    setEditing(!editing);
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
