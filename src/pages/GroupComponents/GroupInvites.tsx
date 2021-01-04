import {useQuery} from '@database';
import {Accordion, AccordionPanel, List} from 'grommet';
import React, {useContext} from 'react';

export function GroupInvites({userid}) {
  let {data} = useQuery<string[]>(
    [
      {
        key: `invites/${userid}`,
        event: 'value',
        cb: (s) => {
          return Object.keys(s.val() ?? {});
        },
      },
    ],
    ([invites]) => {
      return invites;
    }
  );
  console.log(data);
  return (
    <Accordion margin="small">
      <AccordionPanel label="You have group invites (#)">
        <List data={['hello']} />
      </AccordionPanel>
    </Accordion>
  );
}
