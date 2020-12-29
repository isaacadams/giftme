import * as React from 'react';
import {Switch, Route, Redirect, RouteProps} from 'react-router-dom';
import {FirebaseAppContext} from '@firebase';
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
} from '@pages';

function RouterContent(props) {
  let {isAuthenticated} = useContext(FirebaseAppContext).authState;

  return (
    <Switch>
      <Route
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
      />
      {!isAuthenticated && <Redirect to="/login" />}
      <AuthenticatedRoute path="/groups" exact component={GroupPage} />
      <AuthenticatedRoute path="/" exact component={WishlistEditPage} />
      <AuthenticatedRoute path="/groups/:groupname" component={GroupHomePage} />
      <AuthenticatedRoute path="/:username" exact component={ProfilePage} />
      <AuthenticatedRoute
        path="/profile/update"
        exact
        component={ProfileUpdatePage}
      />
    </Switch>
  );

  function AuthenticatedRoute({children, ...route}: RouteProps) {
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
  }
}

export default RouterContent;
