import * as React from 'react';
import {GroupModelForm, UserNameValidation} from '#database';
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

const defaultFormValue: GroupModelForm = {name: ''};

export function CreateGroupButton({onAddGroup, groupnames}) {
  let [show, setShow] = React.useState(false);
  let [value, setValue] = React.useState<GroupModelForm>(defaultFormValue);

  let validation = new UserNameValidation();

  return (
    <>
      <Box
        pad="small"
        align="center"
        justify="center"
        hoverIndicator
        onClick={() => setShow(true)}
      >
        <Stack anchor="top-right">
          <Box fill pad="small">
            <Group size="large" />
          </Box>
          <Add color="brand" />
        </Stack>
        <Text>Create Group</Text>
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
                  (name) => validation.length(name),
                  (name) => validation.urlSafe(name),
                  (name) => {
                    if (groupnames.isValid(name)) return undefined;
                    return `@${name} is taken`;
                  },
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
