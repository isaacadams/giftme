import {getGroupByName, GroupModel, GroupModelForm} from '@firebase';
import {Wishlist} from '../WishlistPage';
import {Box, Heading, Text} from 'grommet';
import * as React from 'react';
import {useParams} from 'react-router-dom';
import {Loader} from '@shared';
import {InviteToGroup} from './InviteToGroup';
import {EditGroupButton} from './EditGroupButton';

interface IProps {
  users: string[];
}

interface IUrlParams {
  groupname: string;
}

export function GroupWishlistPage(props) {
  let [group, setGroup] = React.useState<GroupModel>(null);
  let {groupname} = useParams<IUrlParams>();

  React.useEffect(() => {
    let unsub = getGroupByName(groupname, (g) => {
      setGroup({...g});
    });

    return () => {
      unsub();
    };
  }, [groupname]);

  if (!group) return <Loader />;

  return (
    <>
      <Box
        responsive
        fill="horizontal"
        align="start"
        gap="small"
        margin={{bottom: 'medium'}}
      >
        <Heading size={'30'} margin={'0'}>
          {group.displayName}
        </Heading>
        <Text>@{group.name}</Text>
        <EditGroupButton {...{onEditButtonClick}} />
        <InviteToGroup />
      </Box>
      <Box responsive>
        <GroupWishlist users={Object.keys(group.members)} />
      </Box>
    </>
  );

  function onEditButtonClick() {
    console.log('clicked edit');
  }
}

export function GroupWishlist({users}: IProps) {
  return (
    <Box>{users && users.map((u, i) => <Wishlist key={i} uid={u} />)}</Box>
  );
}
