import {Avatar, AvatarProps} from 'grommet';
import React from 'react';
import {User} from 'grommet-icons';

interface IProps {
  avatarProps?: AvatarProps;
  photoUrl?: string;
}
export function ShowAvatar({avatarProps = {}, photoUrl = ''}) {
  /* if(photoUrl) return <Avatar src={photoUrl} onError={console.log} />; */
  return (
    <Avatar background="accent-1" {...(avatarProps ?? {})}>
      <User color="dark-1" />
    </Avatar>
  );
}
