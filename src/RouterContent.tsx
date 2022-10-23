import * as React from 'react';
import {Routes, Route, RouteProps} from 'react-router-dom';
import {FirebaseAppContext} from '#/firebase';
import {useContext} from 'react';
import {
  WishlistPage,
  SignInPage,
  WishlistEditPage,
  GroupPage,
  GroupWishlistPage,
  ProfilePage,
  ProfileUpdatePage,
  GroupHomePage,
} from '#/pages';

function RouterContent(props) {
  let {isAuthenticated} = useContext(FirebaseAppContext).authState;
  console.log('router content');
  return (
    <Routes>
      {/* <Route
        path="/login"
        render={({location}) =>
          !isAuthenticated ? (
            <SignInPage />
          ) : (
            <Redirect
              to={{
                pathname: '/',
                state: {from: location},
              }}
            />
          )
        }
      /> */}
      {/* <Route path="/login" element={<SignInPage />} /> */}
      {/* {!isAuthenticated && <Redirect to="/login" />} */}
      <Route path="/groups" element={<GroupPage />} />
      <Route path="/" element={<WishlistEditPage />} />
      <Route path="/groups/:groupname" element={<GroupHomePage />} />
      <Route path="/:username" element={<ProfilePage />} />
      <Route path="/profile/update" element={<ProfileUpdatePage />} />
    </Routes>
  );

  /* function AuthenticatedRoute({children, ...route}: RouteProps) {
    return (
      <Route
        {...route}
        render={(props) =>
          isAuthenticated ? (
            children ?? <route.component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: {from: props.location},
              }}
            />
          )
        }
      />
    );
  } */
}

export default RouterContent;
