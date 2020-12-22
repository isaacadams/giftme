import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Box, Grid, Grommet, Header, Main} from 'grommet';
import {grommet} from 'grommet/themes';
import {DisplayFooter} from './DisplayFooter';
import NavigationBar from './NavigationBar';
import Router from './Router';
import {FirebaseAppContext, useFirebaseApp} from '@firebase';

function App(props) {
  return (
    <FirebaseAppContext.Provider value={useFirebaseApp()}>
      <Grommet full theme={grommet}>
        <Grid
          fill="vertical"
          style={{gridTemplateRows: 'min-content 1fr'}}
          gap="small"
        >
          <Header
            fill="horizontal"
            alignContent="between"
            pad={{vertical: 'medium', horizontal: 'medium'}}
          >
            <NavigationBar />
          </Header>
          <Main
            align="center"
            alignContent="center"
            alignSelf="center"
            pad={{vertical: 'medium', horizontal: 'medium'}}
          >
            <Router />
          </Main>
          <Box>
            <DisplayFooter />
          </Box>
        </Grid>
      </Grommet>
    </FirebaseAppContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
