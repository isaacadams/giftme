import * as React from 'react';
import {
  FirebaseAppContext,
  UserGroupRepository,
  GroupModel,
  GroupNamesModel,
} from '@firebase';
import {Box, Text} from 'grommet';
import {Group} from 'grommet-icons';
import {Loader} from '@shared';
import {AddGroupButton} from './GroupComponents/AddGroupButton';

const repo = new UserGroupRepository();

export function GroupPage(props) {
  let [groups, setGroups] = React.useState<GroupModel[]>([]);
  let [groupnames, setGroupnames] = React.useState<GroupNamesModel>(null);
  let [loading, setLoading] = React.useState(true);
  let {user} = React.useContext(FirebaseAppContext).authState;

  React.useEffect(() => {
    console.log('running effect');
    if (!user) return () => {};

    let unsubFromGroupnames = repo.getIsGroupnameValid(setGroupnames);
    let unsubFromGroups = repo.getUserGroups(user?.uid, setGroups, () =>
      setLoading(false)
    );

    return () => {
      unsubFromGroupnames();
      unsubFromGroups();
    };
  }, [user]);

  if (!user || loading) return <Loader />;

  console.log('rerendering group page');

  return (
    <Box direction="row" gap="small">
      <AddGroupButton onAddGroup={createGroup} groupnames={groupnames} />
      {groups &&
        groups.map((g, i) => (
          <Box
            key={i}
            pad="small"
            align="center"
            hoverIndicator
            onClick={() => {}}
          >
            <Box fill pad="small" align="center">
              <Group size="large" />
            </Box>
            <Text>{g.displayName ?? '@' + g.name}</Text>
          </Box>
        ))}
    </Box>
  );

  function createGroup({name, displayName}) {
    if (!repo) return;
    repo.addGroup(user?.uid, name, displayName);
  }
}
