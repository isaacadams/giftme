import {Anchor, Avatar, Box, Header, Menu, Text} from 'grommet';
import React, {useContext} from 'react';
import {Edit, Home, Logout, User, Group} from 'grommet-icons';
import {FirebaseAppContext} from '@firebase';
import {Link} from 'react-router-dom';

function NavigationBar(props) {
  let {signOut, user} = useContext(FirebaseAppContext).authProviders;
  if (!user) return <></>;

  return (
    <Header
      fill="horizontal"
      alignContent="center"
      justify="end"
      pad={{vertical: 'medium', horizontal: 'medium'}}
    >
      <Menu
        label={<ShowAvatar photoUrl={user.photoURL} />}
        margin={{horizontal: 'small'}}
        dropAlign={{top: 'bottom', right: 'right'}}
        dropBackground="light-2"
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
