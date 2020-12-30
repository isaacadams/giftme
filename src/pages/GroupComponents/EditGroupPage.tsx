import {DatabaseModel, GroupModel, useQuery, UserModel} from '@database';
import {Box, Button, Heading, List} from 'grommet';
import {Trash, User} from 'grommet-icons';
import React from 'react';

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
          <Button secondary label="Invite a member" size="small" />
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

function CustomList({
  items,
}: {
  items: Array<JSX.Element | string | React.ReactNode>;
}) {
  return (
    <Box round="xsmall" border>
      {items.map((e, i) => (
        <Box key={i} border={i !== 0 ? {side: 'top'} : undefined} pad="small">
          {e}
        </Box>
      ))}
    </Box>
  );
}

function UserListItem({member, role}) {
  return (
    <Box direction="row" justify="between">
      <Box direction="row" gap="small">
        <Box pad="small">Avatar</Box>
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
