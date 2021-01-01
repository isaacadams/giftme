import {getGroupByName, GroupModel} from '@database';
import * as React from 'react';
import {useParams} from 'react-router-dom';
import {Loader} from '@shared';
import {GroupWishlistPage} from './GroupWishlist';

export interface IUrlParams {
  groupname: string;
}

export interface IGroupHomePageState {
  group: GroupModel;
  groupname: string;
  groupkey: string;
}

export function GroupHomePage() {
  let [loading, setLoading] = React.useState<boolean>(true);
  let [groupHome, setGroupHome] = React.useState<IGroupHomePageState>(null);
  let {groupname} = useParams<IUrlParams>();

  React.useEffect(() => {
    let unsub = getGroupByName(groupname, (group, groupkey) => {
      setGroupHome({group, groupname, groupkey});
      setLoading(false);
    });

    return () => {
      unsub();
    };
  }, [groupname]);

  if (loading) return <Loader />;
  return <GroupWishlistPage {...groupHome} />;
}
