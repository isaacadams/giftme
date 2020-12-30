import {GroupModel} from '@database';
import {Wishlist} from '../WishlistPage';
import {Box, Button, Heading, ResponsiveContext, Text} from 'grommet';
import * as React from 'react';
import {EditGroupPage} from './EditGroupPage';
import {Edit} from 'grommet-icons';

interface IGroupWishlistPageProps {
  group: GroupModel;
}

export function GroupWishlistPage({group}: IGroupWishlistPageProps) {
  let [editing, setEditing] = React.useState(false);
  /* let size = React.useContext(ResponsiveContext);
  console.log(size);
  {...(['small', 'xsmall'].includes(size) ? {justify: 'start'} : {align: 'center'})} */
  return (
    <Box direction="row-responsive" fill>
      <Box
        width="medium"
        height="15rem"
        align="start"
        gap="small"
        pad="medium"
        margin={{bottom: 'medium'}}
      >
        <Heading size={'30'} margin={'0'}>
          {group.displayName}
        </Heading>
        <Text>@{group.name}</Text>
        <Box direction="row" margin={{vertical: 'small'}}>
          <Button
            size="small"
            icon={<Edit />}
            label="Edit Group"
            primary
            onClick={(e) => onEditButtonClick()}
          />
        </Box>
      </Box>
      <Box fill responsive justify="start">
        {editing && <EditGroupPage {...{group, groupname: ''}} />}
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
