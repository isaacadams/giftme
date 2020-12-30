import * as React from 'react';
import {useState} from 'react';
import '@isaacadams/extensions';
import {Box, List, Text} from 'grommet';
import {GiftModel, useData} from '@firebase/database';
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
  let api = useData<GiftModel>(`gifts/${uid}`);
  return <WishlistView name={'My'} gifts={api?.items.map((i) => i.value)} />;
}

interface IProps {
  name: string;
  gifts: GiftModel[];
}

export function WishlistView({name, gifts}: IProps) {
  return (
    <Box gap="small">
      <Box direction="row" justify="center">
        <Text>{name} Wishlist</Text>
      </Box>
      <List data={gifts} pad="small" margin={{top: 'small'}}>
        {(g, i) => <GiftItemView key={i} name={g.name} />}
      </List>
    </Box>
  );
}

export function GiftItemView({name}) {
  return (
    <Box direction="row" fill="horizontal" justify="start" gap="small">
      <Gift />
      <Text>{name}</Text>
    </Box>
  );
}
