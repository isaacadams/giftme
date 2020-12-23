import * as React from 'react';
import {useState} from 'react';
import {Box, Form, TextInput, Text} from 'grommet';
import {
  FirebaseAppContext,
  Gift,
  GiftRepository,
  IDataItems,
  useDataApi,
} from '@firebase';
import {useModal} from '@shared';
import {Trash} from 'grommet-icons';

export function WishlistEditPage(props) {
  let [newGift, setNewGift] = useState<string>('');
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
      <Form onSubmit={(e) => addGift()}>
        <TextInput
          name="newgift"
          placeholder="add a gift"
          value={newGift}
          onChange={(e) => setNewGift(e.currentTarget.value)}
        />
      </Form>
      {api && api.items.map((g, i) => <EditGiftItem key={i} {...g} />)}
    </Box>
  );

  function addGift() {
    let gift = newGift.trim();
    if (gift.isNullOrWhitespace()) return;
    if (api) api.add({name: gift});
    setNewGift('');
  }
}

export function EditGiftItem({value, remove, update}: IDataItems<Gift>) {
  let [gift, setGift] = useState<Gift>(value);

  let {setShow, Modal} = useModal({
    prompt: `Are you sure about deleting '${gift.name}'?`,
    confirmation: remove,
  });
  return (
    <Box
      direction="row"
      fill="horizontal"
      justify="between"
      align="center"
      gap="small"
    >
      <Box fill="horizontal">
        <Form onSubmit={onSubmit} onBlur={onSubmit}>
          <TextInput
            value={gift.name}
            onChange={(e) => setGift({name: e.currentTarget.value})}
          />
        </Form>
      </Box>
      <Trash
        onClick={(e) => {
          setShow(true);
        }}
      />
      {Modal}
    </Box>
  );

  function onSubmit() {
    update(gift);
  }
}
