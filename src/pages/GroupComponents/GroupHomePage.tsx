import {getGroupByName, GroupModel} from '@database';
import * as React from 'react';
import {useParams} from 'react-router-dom';
import {Loader} from '@shared';
import {GroupWishlistPage} from './GroupWishlist';

export interface IUrlParams {
  groupname: string;
}

export function GroupHomePage() {
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
  return <GroupWishlistPage {...{group}} />;
}
