import {DatabaseModel, GroupModel, useQuery, UserModel} from '@database';
import {Box, Button, Heading, List} from 'grommet';
import {Trash, User} from 'grommet-icons';
import React from 'react';
import {CustomList, ShowAvatar} from '@shared';

interface IProps {
  group: GroupModel;
  groupname: string;
}

export function EditGroupPage({groupname, group}: IProps) {
  /* let {data, loading} = useQuery<DatabaseModel['groups']>(
    [
      {
        key: 'groups',
        event: 'value',
        cb: (s) => {
          return s.val();
        },
      },
    ],
    ([users]) => users
  ); */
  let members = Object.keys(group?.members ?? {});

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
              <UserListItem {...{member: null, role: null, key: i}} />
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
          <Box>name</Box>
          <Box>role</Box>
        </Box>
      </Box>
      <Box justify="center">
        <Trash />
      </Box>
    </Box>
  );
}
