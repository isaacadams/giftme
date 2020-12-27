import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Grommet} from 'grommet';
import {grommet} from 'grommet/themes';
import {FirebaseAppProvider} from '@firebase';
import {BrowserRouter as Router} from 'react-router-dom';
import {Body} from './Body';

function App(props) {
  return (
    <Grommet full theme={grommet}>
      <FirebaseAppProvider>
        <Router>
          <Body />
        </Router>
      </FirebaseAppProvider>
    </Grommet>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
