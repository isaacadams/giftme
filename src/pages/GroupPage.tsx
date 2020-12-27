import * as React from 'react';
import {FirebaseAppContext, GroupModel, GroupNamesModel} from '@firebase';
import {Box, Text} from 'grommet';
import {Group} from 'grommet-icons';
import {Loader} from '@shared';
import {AddGroupButton} from './GroupComponents/AddGroupButton';

export function GroupPage(props) {
  let [groups, setGroups] = React.useState<GroupModel[]>([]);
  let [groupnames, setGroupnames] = React.useState<GroupNamesModel>(null);
  let [loading, setLoading] = React.useState(true);
  let {userGroupRepo} = React.useContext(FirebaseAppContext).repos;

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

  if (!userGroupRepo || loading) return <Loader />;

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
    if (!userGroupRepo) return;
    userGroupRepo.addGroup(name, displayName);
  }
}
