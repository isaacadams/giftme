import React, {useState} from 'react';
import {Box, FormField, TextInput, Text, Button} from 'grommet';
import {CustomForm} from '@shared';

interface IDeleteForm {
  groupname: string;
}

export function DeleteGroupView({groupname}) {
  let [showDelete, setShowDelete] = useState(false);
  return (
    <Box pad="small">
      Are you sure? This group cannot be recovered once deleted!
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
        {({formData, FieldComponent}) => (
          <>
            <FormField
              name={'groupname'}
              required
              validate={[
                (name) => {
                  if (name === groupname) return undefined;
                  return 'type in your groupname';
                },
              ]}
            >
              <TextInput
                name="groupname"
                placeholder={groupname}
                value={formData.groupname}
                icon={<Text>@</Text>}
              />
            </FormField>
          </>
        )}
      </CustomForm>
      {showDelete && (
        <Box>
          <Button label="Delete Group" />
        </Box>
      )}
    </Box>
  );
}
