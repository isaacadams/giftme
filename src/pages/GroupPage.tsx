import * as React from 'react';
import {GroupModel, GroupNamesModel} from '@database';
import {FirebaseAppContext} from '@firebase';
import {Anchor, Box, Grid, InfiniteScroll, Text} from 'grommet';
import {Group} from 'grommet-icons';
import {Loader} from '@shared';
import {CreateGroupButton} from './GroupComponents/CreateGroupButton';
import {Link, useHistory} from 'react-router-dom';

export function GroupPage(props) {
  let [groups, setGroups] = React.useState<GroupModel[]>([]);
  let [groupnames, setGroupnames] = React.useState<GroupNamesModel>(null);
  let [loading, setLoading] = React.useState(true);
  let {userGroupRepo} = React.useContext(FirebaseAppContext).repos;
  let history = useHistory();

  React.useEffect(() => {
    console.log('running effect');
    if (!userGroupRepo) return () => {};

    let unsubFromGroupnames = userGroupRepo.getIsGroupnameValid(setGroupnames);
    let unsubFromGroups = userGroupRepo.getUserGroups(setGroups, () =>
      setLoading(false)
    );

    return () => {
      unsubFromGroupnames();
      unsubFromGroups();
    };
  }, [userGroupRepo]);

  if (!userGroupRepo || loading)
    return (
      <Box align="center" justify="center" fill>
        <Loader />
      </Box>
    );

  return (
    <Box margin='small'>
      <Grid columns={{count: 2, size: 'auto'}} rows="auto">
        <CreateGroupButton onAddGroup={createGroup} groupnames={groupnames} />
        <InfiniteScroll items={groups}>
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
    </Box>
  );

  function createGroup({name, displayName}) {
    if (!userGroupRepo) return;
    userGroupRepo.addGroup(name, displayName);
  }
}
