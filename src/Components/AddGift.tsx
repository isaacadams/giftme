import * as React from 'react';
import { useState } from 'react';
import "@isaacadams/extensions";

interface IProp {
    addGift: (gift: string) => void;
}

export function Gifts(props: IProp) {
    
    let [ gifts, setGifts ] = useState([]);
    let [ newGift, setNewGift ] = useState('');

    return (
        <div>
            <form 
                style={{ display: "flex" }} 
                onSubmit={onSubmit}>
                <input 
                    style={{ flex: 1 }} 
                    type="text" 
                    value={newGift}
                    onChange={e => setNewGift(e.target.value)} />
            </form>
            
            <ul>
                {gifts.map((g, i) => 
                    <li key={i}>{g}</li>
                )}
            </ul>
        </div>
    );

    function onSubmit(e) {
        e.preventDefault();
        addGift(newGift);
        setNewGift('');
    }

    function addGift(gift) {
        if(gift.isNullOrWhitespace()) return;

        setGifts([ gift.trim(), ...gifts ]);
    }
}

