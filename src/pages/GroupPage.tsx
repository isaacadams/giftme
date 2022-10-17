import * as React from 'react';
import {
  addGroup,
  getIsGroupnameValid,
  getUserGroups,
  GroupModel,
  GroupNamesModel,
  TableKeyWithItem,
} from '#/database';
import {FirebaseAppContext} from '#/firebase';
import {Anchor, Box, Grid, InfiniteScroll, Text} from 'grommet';
import {Group} from 'grommet-icons';
import {Loader} from '#/shared';
import {CreateGroupButton} from './GroupComponents/CreateGroupButton';
import {Link, useHistory} from 'react-router-dom';
import {GroupInvites} from './GroupComponents/GroupInvites';

export function GroupPage(props) {
  let {user} = React.useContext(FirebaseAppContext).authState;

  return (
    <Box margin="small">
      <GroupInvites {...{userid: user.uid}} />
      <GroupsList {...{userid: user.uid}} />
    </Box>
  );
}

interface IGroupsListProps {
  userid: string;
}

function GroupsList({userid}: IGroupsListProps) {
  let history = useHistory();
  let [groupnames, setGroupnames] = React.useState<GroupNamesModel>(null);
  let [loading, setLoading] = React.useState(true);
  let [userGroups, setUserGroups] = React.useState<GroupModel[]>([]);

  React.useEffect(() => {
    console.log('running groups page effect');
    let isSubscribed = true;
    let unsubFromGroups = getUserGroups(
      userid,
      isSubscribed,
      setUserGroups,
      () => setLoading(false)
    );

    return () => {
      unsubFromGroups();
      isSubscribed = false;
    };
  }, []);

  React.useEffect(() => {
    console.log('running groups list effect');
    let unsubFromGroupnames = getIsGroupnameValid(setGroupnames);
    return () => {
      unsubFromGroupnames();
    };
  }, []);

  if (loading)
    return (
      <Box align="center" justify="center" fill>
        <Loader />
      </Box>
    );

  return (
    <Grid columns={{count: 2, size: 'auto'}} rows="auto">
      <CreateGroupButton onAddGroup={createGroup} groupnames={groupnames} />
      <InfiniteScroll items={userGroups}>
        {(item, i) => (
          <Box
            key={i}
            pad="small"
            align="center"
            justify="center"
            hoverIndicator
            onClick={() => {
              history.push(`/groups/${item.name}`);
            }}
          >
            <Box fill="horizontal" pad="small" align="center">
              <Group size="large" />
            </Box>
            <Text>{item.displayName ?? '@' + item.name}</Text>
          </Box>
        )}
      </InfiniteScroll>
    </Grid>
  );

  function createGroup({name, displayName}) {
    addGroup(userid, name, displayName);
  }
}
