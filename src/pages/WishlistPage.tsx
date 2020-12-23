import * as React from 'react';
import {useState} from 'react';
import '@isaacadams/extensions';
import {Box, Form, TextInput, Text} from 'grommet';
import {FirebaseAppContext, Gift, GiftRepository, useDataApi} from '@firebase';
import {Close, Trash} from 'grommet-icons';
import {useModal} from '@shared';

interface IProp {
  addGift: (gift: string) => void;
}

export function WishlistPage(props: IProp) {
  let [newGift, setNewGift] = useState('');
  let [repo, setRepo] = useState<GiftRepository | null>(null);
  let api = useDataApi(repo);

  let {database, authState} = React.useContext(FirebaseAppContext);
  React.useEffect(() => {
    setRepo(new GiftRepository(database, authState.user));
  }, [database, authState]);

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <TextInput
          placeholder="add your gift"
          value={newGift}
          onChange={(event) => setNewGift(event.target.value)}
        />
      </Form>
      <Box gap="medium" margin={{top: 'small'}}>
        {api && api.items.map((g, i) => (
          <GiftItem key={i} name={g.value.name} remove={g.remove} />
        ))}
      </Box>
    </div>
  );

  function onSubmit(e) {
    e.preventDefault();
    addGift(newGift);
    setNewGift('');
  }

  function addGift(gift: string) {
    gift = gift.trim();
    if (gift.isNullOrWhitespace()) return;
    if(api) api.add({name: gift});
  }
}

function GiftItem({name, remove}) {
  let {setShow, Modal} = useModal({
    prompt: 'Are you sure about deleting this gift?',
    confirmation: remove,
  });
  return (
    <Box direction="row" fill="horizontal" justify="between">
      <Text>{name}</Text>
      <Trash
        onClick={(e) => {
          setShow(true);
        }}
      />
      {Modal}
    </Box>
  );
}
