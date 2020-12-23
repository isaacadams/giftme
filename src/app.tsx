import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Box, Grid, Grommet, Header, Main} from 'grommet';
import {grommet} from 'grommet/themes';
import {DisplayFooter} from './DisplayFooter';
import NavigationBar from './NavigationBar';
import RouterContent from './RouterContent';
import {FirebaseAppContext, useFirebaseApp} from '@firebase';
import {BrowserRouter as Router} from 'react-router-dom';

function App(props) {
  return (
    <FirebaseAppContext.Provider value={useFirebaseApp()}>
      <Router>
        <Grommet full theme={grommet}>
          <Grid
            fill="vertical"
            style={{gridTemplateRows: 'min-content 1fr'}}
            gap="small"
          >
            <Box>
              <NavigationBar />
            </Box>
            <Main
              align="center"
              pad={{vertical: 'medium', horizontal: 'medium'}}
            >
              <RouterContent />
            </Main>
            <Box>
              <DisplayFooter />
            </Box>
          </Grid>
        </Grommet>
      </Router>
    </FirebaseAppContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
