import {getUser, GroupModel, TableKeyWithItem, UserModel} from '@database';
import {Box, Button, Heading} from 'grommet';
import {Trash} from 'grommet-icons';
import React, {useEffect, useState} from 'react';
import {CustomList, useModal, UserItemView} from '@shared';
import {InviteToGroup} from './InviteToGroup';

interface IProps {
  group: GroupModel;
  groupname: string;
}

export function EditGroupPage({groupname, group}: IProps) {
  let [members, setMembers] = useState<TableKeyWithItem<UserModel>[]>([]);
  useEffect(() => {
    Object.keys(group?.members ?? {}).forEach((k) => {
      getUser(k, (user) => {
        setMembers([...members, {key: k, value: user}]);
      });
    });
  }, []);

  let [modalControl, Modal] = useModal({
    children: (controls) => <InviteToGroup />,
  });

  return (
    <>
      {Modal}
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
              onClick={() => modalControl.open()}
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
