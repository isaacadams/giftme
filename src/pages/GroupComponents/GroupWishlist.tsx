import {getGroupByName, GroupModel, GroupModelForm} from '@firebase';
import {Wishlist} from '../WishlistPage';
import {Box} from 'grommet';
import * as React from 'react';
import {useParams} from 'react-router-dom';

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
    getGroupByName(groupname).then(setGroup);
  }, [groupname]);

  return (
    <Box>{group && <GroupWishlist users={Object.keys(group.members)} />}</Box>
  );
}

export function GroupWishlist({users}: IProps) {
  return (
    <Box>{users && users.map((u, i) => <Wishlist key={i} uid={u} />)}</Box>
  );
}
