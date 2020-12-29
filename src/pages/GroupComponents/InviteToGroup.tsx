import {AddifyIcon} from '@shared';
import {Box, Button} from 'grommet';
import {Add, User} from 'grommet-icons';
import React from 'react';

export function InviteToGroup({}) {
  return (
    <Box>
      <Button
        icon={<AddifyIcon icon={<User size="large" />} />}
        label="invite a user"
      />
    </Box>
  );
}
