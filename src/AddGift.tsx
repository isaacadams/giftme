import * as React from 'react';
import {useState} from 'react';
import '@isaacadams/extensions';
import {Form, List, TextInput} from 'grommet';

interface IProp {
  addGift: (gift: string) => void;
}

export function Gifts(props: IProp) {
  let [gifts, setGifts] = useState([]);
  let [newGift, setNewGift] = useState('');

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <TextInput
          placeholder="add your gift"
          value={newGift}
          onChange={(event) => setNewGift(event.target.value)}
        />
      </Form>
      <List primaryKey="name" data={gifts.map((g) => ({name: g}))} />
    </div>
  );

  function onSubmit(e) {
    e.preventDefault();
    addGift(newGift);
    setNewGift('');
  }

  function addGift(gift) {
    if (gift.isNullOrWhitespace()) return;

    setGifts([gift.trim(), ...gifts]);
  }
}
