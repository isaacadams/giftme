import {Box, BoxProps} from 'grommet';
import React from 'react';
import {ShowAvatar} from '@shared';

interface IProps extends BoxProps {
  top?: string | React.ReactNode;
  bottom?: string | React.ReactNode;
}

export function UserItemView({top, bottom, ...props}: IProps) {
  return (
    <Box direction="row" gap="small" {...(props ?? {})}>
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
