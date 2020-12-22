import * as React from 'react';
import {
  Switch,
  Route,
  Redirect,
  BrowserRouter as Router,
} from 'react-router-dom';
import {WrappedComponentProps} from 'react-with-firebase-auth';
import createWithAuth from './auth/createWithAuth';
import SignInPage from './auth/SignInPage';

function MainRouter({
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithGoogle,
  signInWithFacebook,
  signInWithGithub,
  signInWithTwitter,
  signInAnonymously,
  signOut,
  setError,
  user,
  error,
  loading,
}: WrappedComponentProps) {
  return (
    <Router>
      <Switch>
        <Route path="/signin" component={SignInPage} />
        {!user && <Redirect to="/signin" />}
      </Switch>
    </Router>
  );
}

export default createWithAuth(MainRouter);
