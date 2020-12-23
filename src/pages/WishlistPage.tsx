import * as React from 'react';
import {useState} from 'react';
import '@isaacadams/extensions';
import {Box, Form, TextInput, Text} from 'grommet';
import {FirebaseAppContext, GiftRepository} from '@firebase';
import {Close, Trash} from 'grommet-icons';
import {useModal} from '@shared';

interface IProp {
  addGift: (gift: string) => void;
}

export function WishlistPage(props: IProp) {
  let [gifts, setGifts] = useState([]);
  let [newGift, setNewGift] = useState('');
  let [giftRepo, setGiftRepo] = useState<GiftRepository | null>(null);
  let {database, authState} = React.useContext(FirebaseAppContext);

  React.useEffect(() => {
    let repo = new GiftRepository(database, authState.user);
    setGiftRepo(repo);
    repo.getAll().once(
      'value',
      (snapShot) => {
        setGifts(Object.values(snapShot.val()).map((g) => g['name']));
      },
      console.error
    );
  }, [database]);

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
        {gifts.map((g, i) => (
          <GiftItem key={i} name={g} />
        ))}
      </Box>
    </div>
  );

  function onSubmit(e) {
    e.preventDefault();
    addGift(newGift);
    if (giftRepo) giftRepo.create({name: newGift}).catch(console.error);
    setNewGift('');
  }

  function addGift(gift) {
    if (gift.isNullOrWhitespace()) return;

    setGifts([gift.trim(), ...gifts]);
  }
}

function GiftItem({name}) {
  let {setShow, Modal} = useModal({
    prompt: 'Are you sure about deleting this gift?',
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
