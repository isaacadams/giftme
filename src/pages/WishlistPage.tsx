import * as React from 'react';
import {useState} from 'react';
import '@isaacadams/extensions';
import {Box, Text} from 'grommet';
import {GiftRepository, useDataApi} from '@firebase';
import {Gift} from 'grommet-icons';
import {useParams} from 'react-router-dom';
import { Loader } from '@shared';

interface IUrlParams {
  uid: string;
}

export function WishlistPage(props) {
  let {uid} = useParams<IUrlParams>();
  return <Wishlist uid={uid} />;
}

export function Wishlist({uid}) {
  if(!uid) return <Loader />;
  let api = useDataApi(new GiftRepository(uid));

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
