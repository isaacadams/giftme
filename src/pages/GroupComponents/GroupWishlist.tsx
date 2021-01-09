import {deleteGroup} from '@database';
import {Wishlist} from '../WishlistPage';
import {Box, Heading, Text} from 'grommet';
import * as React from 'react';
import {EditGroupPage} from './EditGroupPage';
import {Edit, Trash} from 'grommet-icons';
import {BaseList, useModal} from '@shared';
import {DeleteGroupView} from './DeleteGroupView';
import {IGroupHomePageState} from '@pages';
import {useHistory} from 'react-router-dom';
import {FirebaseAppContext} from '@firebase';

export function GroupWishlistPage({
  group,
  groupname,
  groupkey,
}: IGroupHomePageState) {
  let {user} = React.useContext(FirebaseAppContext).authState;
  let [editing, setEditing] = React.useState(false);
  let [modalControl, DeleteModal] = useModal({
    children: ({close, open}) => (
      <DeleteGroupView
        {...{groupname, close, deleteGroup: deleteAndMoveToGroups}}
      />
    ),
  });
  let history = useHistory();
  let isOwner = user.uid === group.owner;
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
                    modalControl.open();
                  },
                },
              },
            ]}
          />
        )}
      </Box>
      <Box responsive fill="horizontal" justify="start">
        {editing && <EditGroupPage {...{group, groupname, groupkey}} />}
        {!editing && <GroupWishlist users={Object.keys(group.members)} />}
        {DeleteModal}
      </Box>
    </Box>
  );

  function onEditButtonClick() {
    setEditing(!editing);
  }

  function deleteAndMoveToGroups() {
    deleteGroup(groupkey, groupname, group);
    history.push('/groups');
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
