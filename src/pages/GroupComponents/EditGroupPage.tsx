import {getUser, GroupModel, TableKeyWithItem, UserModel} from '@database';
import {Box, Button, Heading} from 'grommet';
import {Trash} from 'grommet-icons';
import React, {useEffect, useState} from 'react';
import {CustomList, ShowAvatar} from '@shared';

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

  return (
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
          <Button primary label="Invite a member" size="small" />
        </Box>
      </Box>
      <CustomList
        items={[
          'search',
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
  );
}

function UserListItem({member, role}) {
  return (
    <Box direction="row" justify="between">
      <Box direction="row" gap="small">
        <Box>
          <ShowAvatar avatarProps={{size: 'medium'}} />
        </Box>
        <Box>
          <Box>{member ?? 'member'}</Box>
          <Box>{role ?? 'role'}</Box>
        </Box>
      </Box>
      <Box justify="center">
        <Trash />
      </Box>
    </Box>
  );
}
