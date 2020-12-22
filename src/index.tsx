import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Box, Grid, Grommet, Header, Main} from 'grommet';
import {grommet} from 'grommet/themes';
import {Gifts} from './Components/AddGift';
import {DisplayFooter} from './DisplayFooter';
import SignInPage from './auth/SignInPage';
import NavigationBar from './NavigationBar';

function App(props) {
  return (
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
          {/* <Routes /> */}
          {/* <Gifts addGift={(s) => console.log(s)} /> */}
          <SignInPage />
        </Main>
        <Box>
          <DisplayFooter />
        </Box>
      </Grid>
    </Grommet>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
