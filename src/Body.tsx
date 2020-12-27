import * as React from 'react';
import {Box, Grid, Main} from 'grommet';
import {DisplayFooter} from './DisplayFooter';
import NavigationBar from './NavigationBar';
import RouterContent from './RouterContent';
import {FirebaseAppContext} from '@firebase';
import {Loader} from '@shared';

export function Body() {
  let context = React.useContext(FirebaseAppContext);
  if (!context) return <Loader />;
  return (
    <Grid
      fill="vertical"
      style={{gridTemplateRows: 'min-content 1fr'}}
      gap="small"
    >
      <Box>
        <NavigationBar />
      </Box>
      <Main align="center" pad={{vertical: 'medium', horizontal: 'medium'}}>
        <RouterContent />
      </Main>
      <Box>
        <DisplayFooter />
      </Box>
    </Grid>
  );
}
