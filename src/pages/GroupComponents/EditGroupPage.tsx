import {GroupModel} from '@firebase';
import {Box} from 'grommet';
import React from 'react';

interface IProps {
  group: GroupModel;
  groupname: string;
}

export function EditGroupPage({groupname, group}: IProps) {
  let mems = Object.keys(group?.members ?? {}) ?? [];
  return (
    <Box>
      <Box>Header with filter and icons</Box>
      <Box>search</Box>
      <Box>
        users
        {mems.map((m, i) => (
          <Box key={i}>{m}</Box>
        ))}
      </Box>
    </Box>
  );
}
