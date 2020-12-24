import * as React from 'react';
import {useState} from 'react';
import '@isaacadams/extensions';
import {Box, Text} from 'grommet';
import {FirebaseAppContext, GiftRepository, useDataApi} from '@firebase';
import {Gift} from 'grommet-icons';
import {useParams} from 'react-router-dom';

interface IUrlParams {
  uid: string;
}

export function WishlistPage(props) {
  let {uid} = useParams<IUrlParams>();
  let {database} = React.useContext(FirebaseAppContext);

  return <Wishlist uid={uid} database={database} />;
}

export function Wishlist({uid, database}) {
  let [repo, setRepo] = useState<GiftRepository | null>(null);
  let api = useDataApi(repo);
  React.useEffect(() => {
    setRepo(new GiftRepository(database, uid));
  }, [database]);

  return (
    <Box>
      <Box direction="row" gap="small">
        <Gift />
        <Text>My Wishlist</Text>
      </Box>
      <Box
        gap="medium"
        margin={{top: 'small'}}
        pad="medium"
        border={{color: 'dark-2', size: 'xsmall'}}
      >
        {api &&
          api.items.map((g, i) => <GiftItemView key={i} name={g.value.name} />)}
      </Box>
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
