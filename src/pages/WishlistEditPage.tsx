import * as React from 'react';
import {useState} from 'react';
import {Box, Form, TextInput, Text, Button} from 'grommet';
import {
  FirebaseAppContext,
  GiftModel,
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

  let {authState} = React.useContext(FirebaseAppContext);
  React.useEffect(() => {
    setRepo(new GiftRepository(authState.user.uid));
  }, [authState]);

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

export function EditGiftItem({value, remove, update}: IDataItems<GiftModel>) {
  let [gift, setGift] = useState<GiftModel>(value);

  let {setShow, Modal} = useModal({
    prompt: `Are you sure about deleting '${gift.name}'?`,
    confirmation: remove,
  });
  return (
    <>
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
        <Button
          icon={<Trash />}
          hoverIndicator
          onClick={(e) => {
            setShow(true);
          }}
        />
      </Box>
      {Modal}
    </>
  );

  function onSubmit() {
    update(gift);
  }
}
