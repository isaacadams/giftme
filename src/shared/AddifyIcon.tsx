import React from 'react';
import {Box, Stack} from 'grommet';
import {Add, IconProps} from 'grommet-icons';

interface IProps {
  icon: JSX.Element;
  addProps?: IconProps & JSX.IntrinsicElements['svg'];
}

export function AddifyIcon({icon, addProps}: IProps): JSX.Element {
  return (
    <Stack anchor="top-right">
      <Box fill pad="small">
        {icon}
      </Box>
      <Add color="brand" {...addProps} />
    </Stack>
  );
}
