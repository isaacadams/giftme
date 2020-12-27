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
  let {user, loading} = useContext(FirebaseAppContext).authState;

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
      <AuthenticatedRoute>
        <Route path="/" exact component={WishlistEditPage} />
        <Route path="/groups/:groupname" component={GroupWishlistPage} />
        <Route path="/groups" component={GroupPage} />
        <Route path="/:uid" component={WishlistPage} />
      </AuthenticatedRoute>
    </Switch>
  );
}

function AuthenticatedRoute({children, ...rest}: RouteProps) {
  let {user, loading} = useContext(FirebaseAppContext).authState;
  if (loading) return <Loader />;

  return (
    <Route
      {...rest}
      render={({location}) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: {from: location},
            }}
          />
        )
      }
    />
  );
}

export default RouterContent;
