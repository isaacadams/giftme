import {Box} from 'grommet';
import React from 'react';
import {ShowAvatar} from '@shared';

export function UserItemView({top, bottom}) {
  return (
    <Box direction="row" gap="small">
      <Box>
        <ShowAvatar avatarProps={{size: 'medium'}} />
      </Box>
      <Box>
        <Box>{top}</Box>
        <Box>{bottom}</Box>
      </Box>
    </Box>
  );
}
