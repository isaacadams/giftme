import * as React from 'react';
import {useState} from 'react';
import {Box, Form, TextInput, Text} from 'grommet';
import {FirebaseAppContext, GiftRepository, useDataApi} from '@firebase';
import {useModal} from '@shared';
import {Trash} from 'grommet-icons';

export function WishlistEditPage(props) {
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
          placeholder="add a gift"
          value={newGift}
          onChange={(event) => setNewGift(event.target.value)}
        />
      </Form>
      <Box
        gap="medium"
        margin={{top: 'small'}}
        pad="small"
        border={{color: 'dark-2', size: 'xsmall'}}
      >
        {api &&
          api.items.map((g, i) => (
            <EditGiftItem key={i} name={g.value.name} remove={g.remove} />
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
    if (api) api.add({name: gift});
  }
}

export function EditGiftItem({name, remove}) {
  let {setShow, Modal} = useModal({
    prompt: `Are you sure about deleting '${name}'?`,
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
