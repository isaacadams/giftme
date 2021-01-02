import {Avatar} from 'grommet';
import React from 'react';
import {User} from 'grommet-icons';

export function ShowAvatar({photoUrl}) {
  /* if(photoUrl) return <Avatar src={photoUrl} onError={console.log} />; */
  return (
    <Avatar background="accent-1">
      <User color="dark-1" />
    </Avatar>
  );
}
