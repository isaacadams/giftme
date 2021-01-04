import React, {useState} from 'react';
import {Box, TextInput, Text, Button} from 'grommet';
import {CustomForm} from '@shared';
import {FormClose} from 'grommet-icons';

interface IDeleteForm {
  groupname: string;
}

export function DeleteGroupView({groupname, close, deleteGroup}) {
  let [showDelete, setShowDelete] = useState(false);
  return (
    <Box>
      <Box
        direction="row"
        background="light-2"
        pad="small"
        justify="start"
        align="center"
      >
        <b>Are you sure?</b>
      </Box>
      <Box pad="small" gap="small">
        <Text>This group cannot be recovered once deleted!</Text>
        <Text>
          Please type <b>{groupname}</b> to confirm
        </Text>
        <CustomForm<IDeleteForm>
          defaultValue={{groupname: ''}}
          formProps={(update) => ({
            validate: 'blur',
            onValidate: ({errors, infos}) => {
              let isValid = Object.values(errors).every((e) => !e);
              setShowDelete(isValid);
            },
          })}
        >
          {({formData, FieldComponent}) => {
            setShowDelete(formData.groupname === groupname);
            return (
              <>
                <TextInput
                  name="groupname"
                  placeholder={groupname}
                  value={formData.groupname}
                  icon={<Text>@</Text>}
                />
              </>
            );
          }}
        </CustomForm>
        <Button
          primary
          disabled={!showDelete}
          color="status-critical"
          label={
            <Box round="xsmall" pad="xsmall" align="center">
              Delete Group
            </Box>
          }
          focusIndicator={false}
          plain
          hoverIndicator
          onClick={deleteGroup}
        />
      </Box>
    </Box>
  );
}
