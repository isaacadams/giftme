import * as React from 'react';
import {useState} from 'react';
import '@isaacadams/extensions';
import {Box, Text} from 'grommet';
import {GiftModel, GiftRepository, useDataApi} from '@firebase';
import {useParams} from 'react-router-dom';
import {Loader} from '@shared';
import {Gift} from 'grommet-icons';

interface IUrlParams {
  uid: string;
}

export function WishlistPage(props) {
  let {uid} = useParams<IUrlParams>();
  return <Wishlist uid={uid} />;
}

export function Wishlist({uid}) {
  if (!uid) return <Loader />;
  let api = useDataApi(new GiftRepository(uid));

  return <WishlistView name="My" gifts={api?.items.map((i) => i.value)} />;
}

interface IProps {
  name: string;
  gifts: GiftModel[];
}

export function WishlistView({name, gifts}: IProps) {
  return (
    <Box>
      <Box direction="row" gap="small">
        <Gift />
        <Text>{name} Wishlist</Text>
      </Box>
      <Box
        gap="medium"
        margin={{top: 'small'}}
        pad="medium"
        border={{color: 'dark-2', size: 'xsmall'}}
      >
        {gifts && gifts.map((g, i) => <GiftItemView key={i} name={g.name} />)}
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
