import * as React from 'react';
import {useState} from 'react';
import {
  Box,
  Form,
  TextInput,
  Text,
  Button,
  Grid,
  Heading,
  Layer,
} from 'grommet';
import {AuthStateContext} from '#/firebase';
import {GiftModel, IDataItems, useData} from '#/database';
import {Trash} from 'grommet-icons';

export function WishlistEditPage(props) {
  let [newGift, setNewGift] = useState<string>('');
  let {user} = React.useContext(AuthStateContext);
  let api = useData<GiftModel>(`gifts/${user.uid}`);

  return (
    <Box gap="medium" margin={{top: 'small'}} pad="small">
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
    confirmation: () => {
      remove().catch((e) => console.error(e));
    },
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

interface IModalProps {
  title?: string;
  prompt: string;
  confirmation?: () => void;
}

function useModal({title, prompt, confirmation}: IModalProps) {
  let [show, setShow] = useState(false);

  return {
    show,
    setShow,
    Modal: show && (
      <Layer onEsc={() => setShow(false)} onClickOutside={() => setShow(false)}>
        <Grid>
          {title && (
            <Box direction="row" fill="horizontal" justify="start">
              <Heading margin="small" size="20">
                {title}
              </Heading>
            </Box>
          )}
          <Box pad="medium" direction="row" fill="horizontal">
            <Text>{prompt}</Text>
          </Box>
          <Box direction="row" fill="horizontal" justify="end">
            <Box margin="small">
              <Button label="cancel" onClick={() => setShow(false)} />
            </Box>
            <Box margin="small">
              <Button
                label="ok"
                onClick={(e) => {
                  confirmation();
                  setShow(false);
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Layer>
    ),
  };
}
