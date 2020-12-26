import * as React from 'react';
import {
  GroupModel,
  GroupRepository,
  FirebaseAppContext,
  UserRepository,
  UserGroupRepository,
} from '@firebase';
import {
  Box,
  Button,
  Form,
  FormField,
  Layer,
  Stack,
  Text,
  TextInput,
} from 'grommet';
import {Add, Group} from 'grommet-icons';

export function FamilyPage(props) {
  let [groups, setGroups] = React.useState([]);
  let [repo, setRepo] = React.useState<UserGroupRepository | null>(null);
  let {user} = React.useContext(FirebaseAppContext).authState;


  React.useEffect(() => {
    if(!user) return () => {};

    let r = new UserGroupRepository(user);
    setRepo(r);
    return r.getUserGroups(setGroups);
  }, [user]);

  console.log('rendering main');

  return (
    <Box direction="row" gap="small">
      <AddFamilyButton onAddGroup={createGroup} />
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
            <Text>{g['displayName']}</Text>
          </Box>
        ))}
    </Box>
  );

  function createGroup({name, displayName}) {
    if (!repo) return;
    repo.addGroup(name, displayName);
  }
}

function AddFamilyButton({onAddGroup}) {
  let [show, setShow] = React.useState(false);
  let [value, setValue] = React.useState({});
  return (
    <>
      <Box
        pad="small"
        align="center"
        hoverIndicator
        onClick={() => setShow(true)}
      >
        <Stack anchor="top-right">
          <Box fill pad="small">
            <Group size="large" />
          </Box>
          <Add color="brand" />
        </Stack>
        <Text>Add Group</Text>
      </Box>
      {show && (
        <Layer margin="small" onClickOutside={closeModal} onEsc={closeModal}>
          <Box pad="medium" fill="vertical" justify="center">
            <Form
              value={value}
              onChange={(nextValue) => setValue(nextValue)}
              onReset={() => setValue({})}
              onSubmit={({value}) => {
                onAddGroup(value);
                closeModal();
              }}
            >
              <FormField label="Name">
                <TextInput name="name" value={value['name'] ?? ''} />
              </FormField>
              <FormField label="Display Name (optional)">
                <TextInput
                  name="displayName"
                  value={value['displayName'] ?? ''}
                />
              </FormField>
              <Box direction="row" justify="between">
                <Button label="Close" onClick={closeModal} />
                <Box direction="row" gap="small">
                  {/* <Button type="reset" label="Reset" /> */}
                  <Button type="submit" primary label="Submit" />
                </Box>
              </Box>
            </Form>
          </Box>
        </Layer>
      )}
    </>
  );

  function closeModal() {
    setShow(false);
  }
}
