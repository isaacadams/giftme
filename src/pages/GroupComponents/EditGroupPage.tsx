import {getUser, GroupModel, TableKeyWithItem, UserModel} from '@database';
import {Box, Button, Heading, Layer} from 'grommet';
import {Trash} from 'grommet-icons';
import React, {useEffect, useState} from 'react';
import {CustomList, UserItemView} from '@shared';
import {InviteToGroup} from './InviteToGroup';

interface IProps {
  group: GroupModel;
  groupname: string;
}

export function EditGroupPage({groupname, group}: IProps) {
  let [showInvite, setShowInvite] = React.useState(false);
  let [members, setMembers] = useState<TableKeyWithItem<UserModel>[]>([]);
  useEffect(() => {
    Object.keys(group?.members ?? {}).forEach((k) => {
      getUser(k, (user) => {
        setMembers([...members, {key: k, value: user}]);
      });
    });
  }, []);

  return (
    <>
      {showInvite && (
        <Layer onEsc={closeInviteModal} onClickOutside={closeInviteModal}>
          <InviteToGroup />
        </Layer>
      )}
      <Box width="large">
        <Box
          direction="row"
          align="center"
          height={{max: 'medium'}}
          justify="between"
          margin={{bottom: 'small'}}
        >
          <Heading style={{margin: '0'}} level="3">
            Manage members
          </Heading>
          <Box justify="end">
            <Button
              primary
              label="Invite a member"
              size="small"
              onClick={() => setShowInvite(true)}
            />
          </Box>
        </Box>
        <CustomList
          items={[
            //'search',
            <>
              {members.map((m, i) => (
                <UserListItem
                  {...{
                    member: m.value.displayName ?? `@${m.value.username}`,
                    role: group.owner === m.key ? 'owner' : 'member',
                    key: i,
                  }}
                />
              ))}
            </>,
          ]}
        />
      </Box>
    </>
  );

  function closeInviteModal() {
    setShowInvite(false);
  }
}

function UserListItem({member, role}) {
  return (
    <Box direction="row" justify="between">
      <UserItemView top={member ?? 'member'} bottom={role ?? 'role'} />
      <Box justify="center">
        <Trash />
      </Box>
    </Box>
  );
}
