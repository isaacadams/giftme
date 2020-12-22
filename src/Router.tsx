import * as React from 'react';
import {
  Switch,
  Route,
  Redirect,
  BrowserRouter as Router,
  RouteProps,
} from 'react-router-dom';
import {Gifts} from './AddGift';
import SignInPage from './auth/SignInPage';
import {useAuth} from './auth/useAuth';

function MainRouter(props) {
  let {user} = useAuth();
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
  let {user} = useAuth();
  let ChildComponent = component;
  return (
    <Route
      {...rest}
      render={(routerProps) =>
        !!user ? (
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
