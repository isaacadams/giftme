import {FirebaseAppContext} from '#firebase';
import {UserNameValidation} from '#database';
import {Loader} from '#shared';
import {Box, FormField, TextInput, Text} from 'grommet';
import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {CustomForm} from '#shared';

interface IUserRequiredFieldsForm {
  username: string;
}

const defaultFormValue: IUserRequiredFieldsForm = {username: ''};

export function ProfileUpdatePage(props) {
  let history = useHistory();
  let {repos, usernamesHook} = useContext(FirebaseAppContext);
  let {userRepo} = repos;
  let {usernames, loading} = usernamesHook;
  if (loading) return <Loader />;
  let validation = new UserNameValidation();

  return (
    <Box pad="medium" fill="vertical" justify="start" margin={{top: 'medium'}}>
      <CustomForm
        showTray
        defaultValue={defaultFormValue}
        formProps={(update) => ({
          onSubmit: ({value}) => {
            try {
              userRepo.addUsername(value.username).then(() => {
                history.push('/');
              });
            } catch (e) {
              update(defaultFormValue);
              console.error(e);
            }
          },
          validate: 'blur',
        })}
      >
        {({formData, FieldComponent}) => (
          <FormField
            label="create a username"
            required
            validate={[
              validation.length,
              validation.urlSafe,
              (name) => {
                name = name.trim().toLowerCase();
                if (!usernames.includes(name)) return undefined;
                return `@${name} is taken`;
              },
            ]}
            name="username"
          >
            <TextInput
              icon={<Text>@</Text>}
              name="username"
              value={formData.username}
            />
          </FormField>
        )}
      </CustomForm>
    </Box>
  );
}
