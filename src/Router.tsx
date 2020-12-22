import * as React from 'react';
import {
  Switch,
  Route,
  Redirect,
  BrowserRouter as Router,
  RouteProps,
} from 'react-router-dom';
import {Gifts} from './AddGift';
import {Loader} from '@shared';
import {FirebaseAppContext, SignInPage} from '@firebase';
import {useContext} from 'react';

function MainRouter(props) {
  let {user} = useContext(FirebaseAppContext).authState;
  return (
    <Router>
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
        <AuthenticatedRoute path="/" exact component={Gifts} />
      </Switch>
    </Router>
  );
}

function AuthenticatedRoute({children, component, ...rest}: RouteProps) {
  let {isAuthenticated, initializing} = useContext(
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

export default MainRouter;
