import * as React from 'react';
import {Switch, Route, Redirect, RouteProps} from 'react-router-dom';
import {Loader} from '@shared';
import {FirebaseAppContext} from '@firebase';
import {useContext} from 'react';
import {
  WishlistPage,
  SignInPage,
  WishlistEditPage,
  GroupPage,
  GroupWishlistPage,
} from '@pages';

function RouterContent(props) {
  let {user, isAuthenticated, loading} = useContext(
    FirebaseAppContext
  ).authState;

  if (loading && !user) return <Loader />;

  return (
    <Switch>
      <Route
        path="/login"
        render={({location}) =>
          !user ? (
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
      <AuthenticatedRoute
        path="/groups/:groupname"
        component={GroupWishlistPage}
      />
      <AuthenticatedRoute path="/groups" component={GroupPage} />
      <AuthenticatedRoute path="/" exact component={WishlistEditPage} />
      <Route path="/:uid" component={WishlistPage} />
      {!isAuthenticated && <Redirect to="/login" />}
    </Switch>
  );
}

function AuthenticatedRoute({children, component, ...rest}: RouteProps) {
  let {user, loading} = useContext(FirebaseAppContext).authState;
  if (loading) return <Loader />;

  let ChildComponent = component;
  return (
    <Route
      {...rest}
      render={(routerProps) =>
        user ? (
          <ChildComponent {...routerProps} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: {from: routerProps.location},
            }}
          />
        )
      }
    />
  );
}

export default RouterContent;
