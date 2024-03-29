import * as React from 'react';
import '@isaacadams/extensions';
import {Box, List, Text} from 'grommet';
import {GiftModel, Table, UserModel, useSelect} from '#/database';
import {useParams} from 'react-router-dom';
import {Loader} from '#/shared';
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
  let gifts = useSelect<Table<GiftModel>>(`gifts/${uid}`);
  let user = useSelect<UserModel>(`users/${uid}`);

  return (
    <WishlistView name={user?.displayName} gifts={Object.values(gifts ?? {})} />
  );
}

interface IProps {
  name: string;
  gifts: GiftModel[];
}

export function WishlistView({name, gifts}: IProps) {
  return (
    <Box gap="small" width={{max: '40rem'}}>
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
