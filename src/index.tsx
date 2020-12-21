import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Box, Grid, Grommet, Header, Main} from 'grommet';
import {grommet} from 'grommet/themes';
import {Gifts} from './Components/AddGift';

function App(props) {
  return (
    <Grommet full theme={grommet}>
      <Grid></Grid>
      <Grid
        fill="vertical"
        style={{gridTemplateRows: 'min-content 1fr'}}
        gap="small"
      >
        <Header fill="horizontal" justify="center" pad={{vertical: 'medium'}}>
          {/* <Navigation /> */}
        </Header>
        <Main align="center" pad={{vertical: 'medium', horizontal: 'medium'}}>
          {/* <Routes /> */}
          <Gifts addGift={(s) => console.log(s)} />
        </Main>
        <Box>{/* <DisplayFooter /> */}</Box>
      </Grid>
    </Grommet>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
