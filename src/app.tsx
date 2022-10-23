import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Grommet} from 'grommet';
import {grommet} from 'grommet/themes';
import {FirebaseAppProvider} from '#/firebase';
import {BrowserRouter as Router} from 'react-router-dom';
import {Body} from './Body';
import {deepMerge} from 'grommet/utils';

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
        <FirebaseAppProvider>
          <Body />
        </FirebaseAppProvider>
      </Router>
    </Grommet>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
