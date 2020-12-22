import * as React from 'react';
import {Text, Footer, Anchor} from 'grommet';
import pkgjson from '../package.json';
import {Github} from 'grommet-icons';

export function DisplayFooter() {
  return (
    <Footer background="brand" pad="medium">
      <Text>{pkgjson.author}</Text>
      <Text>{pkgjson.version}</Text>
      <Anchor icon={<Github />} label="source" href={pkgjson.homepage} />
    </Footer>
  );
}
