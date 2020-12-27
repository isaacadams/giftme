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
import {Link} from 'react-router-dom';

function NavigationBar(props) {
  let {signOut, user} = useContext(FirebaseAppContext).authProviders;
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
      {...headerProps}
    >
      <Menu
        {...menuProps}
        justifyContent="end"
        label={<ShowAvatar photoUrl={user.photoURL} />}
        dropAlign={{top: 'bottom', right: 'right'}}
        dropBackground="light-2"
        dropProps={{responsive: true, stretch: true}}
        items={[
          {
            label: (
              <Link to={`/${user.uid}`}>
                <Anchor
                  icon={<Home />}
                  label={user.displayName}
                  color="dark-2"
                  as="div"
                />
              </Link>
            ),
          },
          {
            label: (
              <Link to="/groups">
                <Anchor
                  icon={<Group />}
                  label="Groups"
                  color="dark-2"
                  as="div"
                />
              </Link>
            ),
          },
          {
            label: (
              <Link to={`/`}>
                <Anchor
                  icon={<Edit />}
                  label="Edit Wishlist"
                  color="dark-2"
                  as="div"
                />
              </Link>
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
