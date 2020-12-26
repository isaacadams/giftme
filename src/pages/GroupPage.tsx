import * as React from 'react';
import {
  FirebaseAppContext,
  UserGroupRepository,
  isUrlSafe,
  GroupModel,
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
  let [groupnames, setGroupnames] = React.useState(null);
  let [repo, setRepo] = React.useState<UserGroupRepository | null>(null);
  let {user} = React.useContext(FirebaseAppContext).authState;

  React.useEffect(() => {
    if (!user) return () => {};

    let r = new UserGroupRepository(user);
    r.getIsGroupnameValid().then(setGroupnames);
    setRepo(r);
    return r.getUserGroups(setGroups);
  }, [user]);

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

const defaultFormValue: GroupModel = {name: ''};

function AddGroupButton({onAddGroup, groupnames}) {
  let [show, setShow] = React.useState(false);
  let [value, setValue] = React.useState<GroupModel>(defaultFormValue);

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
              onChange={({name, displayName}) => {
                setValue({name, displayName});
              }}
              onReset={resetForm}
              onSubmit={({value}) => {
                onAddGroup(value);
                resetForm();
                closeModal();
              }}
              validate="blur"
            >
              <FormField
                label="Name"
                required
                validate={[
                  //{ regexp: /^[a-z]/i },
                  (name) => {
                    if (!name) return undefined;

                    if (name.length > 16) return 'must be <=16 characters';
                    if (name.length < 4) return 'must be >=4 characters';

                    return undefined;
                  },
                  (name) => {
                    if (isUrlSafe(name)) return undefined;
                    return 'invalid name';
                  },
                  (name) => {
                    if (groupnames.isValid(name)) return undefined;
                    return `@${name} is taken`;
                  },
                  /* name => {
                if (name === 'good')
                  return {
                    message: (
                      <Box align="end">
                        <StatusGood />
                      </Box>
                    ),
                    status: 'info',
                  };
                return undefined;
              }, */
                ]}
                name="name"
              >
                <TextInput
                  icon={<Text>@</Text>}
                  id="name-id"
                  name="name"
                  value={value.name}
                />
              </FormField>
              <FormField label="Display Name (optional)" name="displayName">
                <TextInput
                  name="displayName"
                  value={value?.displayName ?? ''}
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

  function resetForm() {
    setValue(defaultFormValue);
  }
}
