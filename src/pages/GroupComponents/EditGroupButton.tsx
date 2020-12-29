import {Box, Text, Button} from 'grommet';
import {Edit} from 'grommet-icons';
import React from 'react';

export function EditGroupButton({onEditButtonClick}) {
  return (
    <Box
      direction="row"
      round
      gap="small"
      pad={{vertical: 'small', horizontal: 'large'}}
      hoverIndicator
      onClick={() => {
        onEditButtonClick();
      }}
      background="light-4"
    >
      <Edit />
      <Text>Edit Group</Text>
    </Box>
  );
}
