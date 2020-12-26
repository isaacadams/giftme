import * as React from 'react';
import {Switch, Route, Redirect, RouteProps} from 'react-router-dom';
import {Loader} from '@shared';
import {FirebaseAppContext} from '@firebase';
import {useContext} from 'react';
import {WishlistPage, SignInPage, WishlistEditPage, GroupPage} from '@pages';

function RouterContent(props) {
  let {user} = useContext(FirebaseAppContext).authState;

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
      <Route path="/groups" component={GroupPage} />
      <AuthenticatedRoute path="/" exact component={WishlistEditPage} />
      <AuthenticatedRoute path="/:uid" component={WishlistPage} />
      {!user && <Redirect to="/login" />}
    </Switch>
  );
}

function AuthenticatedRoute({children, component, ...rest}: RouteProps) {
  let {isAuthenticated, loading: initializing} = useContext(
    FirebaseAppContext
  ).authState;
  if (initializing) return <Loader />;

  let ChildComponent = component;
  return (
    <Route
      {...rest}
      render={(routerProps) =>
        isAuthenticated ? (
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
