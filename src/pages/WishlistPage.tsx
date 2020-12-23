import * as React from 'react';
import {useState} from 'react';
import '@isaacadams/extensions';
import {Box, Text} from 'grommet';
import {FirebaseAppContext, GiftRepository, useDataApi} from '@firebase';

export function WishlistPage(props) {
  let [repo, setRepo] = useState<GiftRepository | null>(null);
  let api = useDataApi(repo);

  let {database, authState} = React.useContext(FirebaseAppContext);
  React.useEffect(() => {
    setRepo(new GiftRepository(database, authState.user));
  }, [database, authState]);

  return (
    <Box
      gap="medium"
      margin={{top: 'small'}}
      pad="small"
      border={{color: 'dark-2', size: 'xsmall'}}
    >
      {api &&
        api.items.map((g, i) => <GiftItemView key={i} name={g.value.name} />)}
    </Box>
  );
}

export function GiftItemView({name}) {
  return (
    <Box direction="row" fill="horizontal" justify="between">
      <Text>{name}</Text>
    </Box>
  );
}
