import {GroupModel} from '@database';
import {Wishlist} from '../WishlistPage';
import {Box, Button, Heading, Layer, ResponsiveContext, Text} from 'grommet';
import * as React from 'react';
import {EditGroupPage} from './EditGroupPage';
import {Edit, Trash} from 'grommet-icons';
import {BaseList, CustomList} from '@shared';
import {DeleteGroupView} from './DeleteGroupView';

interface IGroupWishlistPageProps {
  group: GroupModel;
  groupname: string;
}

export function GroupWishlistPage({group, groupname}: IGroupWishlistPageProps) {
  let [editing, setEditing] = React.useState(false);
  let [showDelete, setShowDelete] = React.useState(false);
  /* let size = React.useContext(ResponsiveContext);
  console.log(size);
  {...(['small', 'xsmall'].includes(size) ? {justify: 'start'} : {align: 'center'})} */
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
        fill="vertical"
        align="start"
        gap="small"
        margin={{bottom: 'medium'}}
      >
        <Heading size={'30'} margin={'0'}>
          {group.displayName}
        </Heading>
        <Text>@{group.name}</Text>
        <BaseList
          fill="horizontal"
          itemProps={{
            direction: 'row',
            gap: 'small',
            hoverIndicator: true,
            focusIndicator: false,
          }}
          items={[
            {
              children: [
                <Edit size="medium" />,
                <Text size="medium">Edit Group</Text>,
              ],
              props: {
                onClick: (e) => onEditButtonClick(),
              },
            },
            {
              children: [
                <Trash size="medium" />,
                <Text size="medium">Delete Group</Text>,
              ],
              props: {
                onClick: (e) => {
                  setShowDelete(!showDelete);
                },
              },
            },
          ]}
        />
      </Box>
      <Box responsive fill="horizontal" justify="start">
        {editing && <EditGroupPage {...{group, groupname: ''}} />}
        {!editing && <GroupWishlist users={Object.keys(group.members)} />}
        {showDelete && (
          <Layer
            margin="small"
            onEsc={() => {
              setShowDelete(false);
            }}
            onClickOutside={() => {
              setShowDelete(false);
            }}
          >
            <DeleteGroupView {...{groupname}} />
          </Layer>
        )}
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
