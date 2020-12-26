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
  let [userRepo, setUserRepo] = React.useState<UserRepository | null>(null);
  let [
    userGroupRepo,
    setUserGroupRepo,
  ] = React.useState<UserGroupRepository | null>(null);
  let [familyRepo, setFamilyRepo] = React.useState<GroupRepository | null>(
    null
  );

  let {database, authState} = React.useContext(FirebaseAppContext);
  let {user} = authState;

  React.useEffect(() => {
    setUserRepo(new UserRepository(database));
    setFamilyRepo(new GroupRepository(database));
    setUserGroupRepo(new UserGroupRepository());
  }, [database, user]);

  //let u = usersRepo.getOne(user.uid);

  return (
    <Box direction="row">
      <AddFamilyButton onAddGroup={createGroup} />
    </Box>
  );

  function createGroup({name, displayName}) {
    if (!userGroupRepo) return;
    userGroupRepo.addGroup(name, displayName);
    //if(!familyRepo) return;
    //familyRepo.create({name, members: [user.uid]});
  }
}

function AddFamilyButton({onAddGroup}) {
  let [show, setShow] = React.useState(false);
  let [value, setValue] = React.useState({});
  return (
    <>
      <Box
        pad="small"
        border={{color: 'dark-1', size: 'xsmall'}}
        align="center"
        hoverIndicator
        onClick={() => setShow(true)}
      >
        <Stack anchor="top-right">
          <Box fill pad="medium">
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
                <TextInput name="displayName" value={value['displayName'] ?? ''} />
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
