import {
  getGroup,
  GroupInviteHelper,
  GroupModel,
  TableKeyWithItem,
  useQuery,
} from '@database';
import {Accordion, AccordionPanel, Box} from 'grommet';
import {FormCheckmark, FormClose} from 'grommet-icons';
import React, {useEffect, useState} from 'react';

export function GroupInvites({userid}: {userid: string}) {
  console.log('GroupInvites: rendering');
  let {data} = useQuery<string[]>(
    [
      {
        key: `invites/${userid}`,
        event: 'value',
        cb: (s, b) => {
          return Object.keys(s.val() ?? {});
        },
      },
    ],
    ([invites]) => {
      return invites;
    }
  );

  let [groupsInvited, setGroupsInvited] = useState<
    TableKeyWithItem<GroupModel>[]
  >([]);
  useEffect(() => {
    let isSubscribed = !!data;
    if (isSubscribed) {
      Promise.all(data.map((g) => getGroup(g))).then((g) => {
        setGroupsInvited([...g, ...groupsInvited]);
      });
    }
    return () => (isSubscribed = false);
  }, [data]);
  console.log(data);
  return (
    <Accordion margin="small" style={{border: 'none'}}>
      <AccordionPanel label={`You have group invites (${data?.length})`}>
        {groupsInvited.map((g, i) => (
          <InviteButton
            key={i}
            name={g.displayName ?? '@' + g.name}
            accept={() =>
              new GroupInviteHelper(userid, g.key).confirmInviteToGroup()
            }
            reject={() =>
              new GroupInviteHelper(userid, g.key).denyInviteToGroup()
            }
          />
        ))}
      </AccordionPanel>
    </Accordion>
  );
}

function InviteButton({name, accept, reject}) {
  return (
    <Box direction="row" pad="small" justify="between">
      {name}
      <Box direction="row" gap="small">
        <FormCheckmark color="status-ok" onClick={accept} />
        <FormClose color="status-error" onClick={reject} />
      </Box>
    </Box>
  );
}
