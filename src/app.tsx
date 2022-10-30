import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Grommet} from 'grommet';
import {grommet} from 'grommet/themes';
import {FirebaseAppProvider, AuthStateProvider} from '#/firebase';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Body} from './Body';
import {deepMerge} from 'grommet/utils';
import {SignInPage} from './pages';

let merged = deepMerge(grommet, {
  button: {
    border: {
      radius: '6px',
    },
  },
});

function App(props) {
  return (
    <Grommet full theme={merged}>
      <Router>
        <AuthStateProvider>
          <Routes>
            <Route path="/login" element={<SignInPage />} />
          </Routes>
          <FirebaseAppProvider>
            <Body />
          </FirebaseAppProvider>
        </AuthStateProvider>
      </Router>
    </Grommet>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
