import {deleteGroup} from '#database';
import {Wishlist} from '../WishlistPage';
import {Box, Heading, Text} from 'grommet';
import * as React from 'react';
import {EditGroupPage} from './EditGroupPage';
import {IGroupHomePageState} from '#pages';
import {FirebaseAppContext} from '#firebase';
import {GroupAdminControls} from './GroupAdminControls';

export function GroupWishlistPage({
  group,
  groupname,
  groupkey,
}: IGroupHomePageState) {
  let {user} = React.useContext(FirebaseAppContext).authState;
  let [editing, setEditing] = React.useState(false);

  let isOwner = user.uid === group.owner;
  let deleteTheGroup = () => {
    deleteGroup(groupkey, groupname, group);
  };
  return (
    <Box
      width={{max: '1280px'}}
      fill="horizontal"
      direction="row-responsive"
      justify="center"
      pad="medium"
      gap="large"
    >
      <Box
        width="20rem"
        height={{min: 'auto'}}
        align="start"
        gap="small"
        margin={{bottom: 'medium'}}
      >
        <Heading size={'30'} margin={'0'}>
          {group.displayName}
        </Heading>
        <Text>@{group.name}</Text>
        {isOwner && (
          <GroupAdminControls
            {...{groupname, deleteTheGroup, onEditButtonClick}}
          />
        )}
      </Box>
      <Box responsive fill="horizontal" justify="start">
        {editing && <EditGroupPage {...{group, groupname, groupkey}} />}
        {!editing && <GroupWishlist users={Object.keys(group.members)} />}
      </Box>
    </Box>
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
    <Box width="medium">
      {users && users.map((u, i) => <Wishlist key={i} uid={u} />)}
    </Box>
  );
}
