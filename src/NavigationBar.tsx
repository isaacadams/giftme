import {
  Anchor,
  Avatar,
  Box,
  Header,
  Menu,
  ResponsiveContext,
  Text,
} from 'grommet';
import React, {useContext} from 'react';
import {Edit, Home, Logout, User, Group} from 'grommet-icons';
import {FirebaseAppContext} from '@firebase';
import {Link, useHistory} from 'react-router-dom';

function NavigationBar(props) {
  let {signOut, user} = useContext(FirebaseAppContext).authProviders;
  let history = useHistory();
  const size = React.useContext(ResponsiveContext);

  let responsiveMenuProps = {
    small: {
      fill: true,
    },
  };

  let menuProps = responsiveMenuProps[size] ?? {margin: {horizontal: 'small'}};
  let headerProps =
    size === 'small' ? {} : {pad: {vertical: 'medium', horizontal: 'medium'}};

  if (!user) return <></>;

  return (
    <Header
      fill="horizontal"
      alignContent="center"
      justify="end"
      background="light-2"
      {...headerProps}
    >
      <Menu
        {...menuProps}
        justifyContent="start"
        label={<ShowAvatar photoUrl={user.photoURL} />}
        dropAlign={{top: 'bottom', right: 'right'}}
        dropBackground="light-2"
        dropProps={{
          responsive: true,
          stretch: true,
          onClickOutside: () => console.log('outside'),
        }}
        items={[
          {
            onClick: () => history.push(`/${user.uid}`),
            label: (
              <Anchor
                icon={<Home />}
                label={user.displayName}
                color="dark-2"
                as="div"
              />
            ),
          },
          {
            onClick: () => history.push(`/groups`),
            label: (
              <Anchor icon={<Group />} label="Groups" color="dark-2" as="div" />
            ),
          },
          {
            onClick: () => history.push(`/`),
            label: (
              <Anchor
                icon={<Edit />}
                label="Edit Wishlist"
                color="dark-2"
                as="div"
              />
            ),
          },
          {
            label: (
              <Anchor
                icon={<Logout />}
                label="Logout"
                color="dark-2"
                onClick={signOut}
              />
            ),
          },
        ]}
      />
    </Header>
  );
}

function ShowAvatar({photoUrl}) {
  /* if(photoUrl) return <Avatar src={photoUrl} onError={console.log} />; */

  return (
    <Avatar background="accent-1">
      <User color="dark-1" />
    </Avatar>
  );
}

export default NavigationBar;
