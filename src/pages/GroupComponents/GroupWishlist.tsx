import {deleteGroup} from '@database';
import {Wishlist} from '../WishlistPage';
import {Box, Heading, Layer, Text} from 'grommet';
import * as React from 'react';
import {EditGroupPage} from './EditGroupPage';
import {Edit, Trash} from 'grommet-icons';
import {BaseList} from '@shared';
import {DeleteGroupView} from './DeleteGroupView';
import {IGroupHomePageState} from '@pages';
import {useHistory} from 'react-router-dom';

export function GroupWishlistPage({
  group,
  groupname,
  groupkey,
}: IGroupHomePageState) {
  let [editing, setEditing] = React.useState(false);
  let [showDelete, setShowDelete] = React.useState(false);
  let history = useHistory();
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
          <Layer onEsc={close} onClickOutside={close}>
            <DeleteGroupView
              {...{groupname, close, deleteGroup: deleteAndMoveToGroups}}
            />
          </Layer>
        )}
      </Box>
    </Box>
  );

  function onEditButtonClick() {
    setEditing(!editing);
  }

  function close() {
    setShowDelete(false);
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
