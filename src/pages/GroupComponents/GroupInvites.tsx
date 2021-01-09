import {
  getGroup,
  GroupInviteHelper,
  GroupModel,
  TableKeyWithItem,
  useQuery,
} from '@database';
import {Box, Text} from 'grommet';
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
        setGroupsInvited([...g]);
      });
    }
    return () => (isSubscribed = false);
  }, [data]);
  console.log(data);
  return (
    <>
      <AccordianBox
        label={<Text>{`You have group invites (${data?.length})`}</Text>}
      >
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
      </AccordianBox>
    </>
  );
}

function AccordianBox({label, children, ...props}) {
  let [show, setShow] = useState(false);
  let style = show ? {} : {display: 'none'};
  return (
    <>
      <Box onClick={() => setShow(!show)}>{label}</Box>
      <Box {...props} style={style}>
        {children}
      </Box>
    </>
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
