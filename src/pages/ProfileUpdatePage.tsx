import {FirebaseAppContext} from '#firebase';
import {UserNameValidation} from '#database';
import {Loader} from '#shared';
import {
  Box,
  FormField,
  TextInput,
  Text,
  Form,
  TypedForm,
  Button,
} from 'grommet';
import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';

interface IUserRequiredFieldsForm {
  username: string;
}

const LocalForm = Form as TypedForm<IUserRequiredFieldsForm>;

const defaultFormValue: IUserRequiredFieldsForm = {username: ''};

export function ProfileUpdatePage(props) {
  let history = useHistory();
  let {repos, usernamesHook} = useContext(FirebaseAppContext);
  let [value, setValue] = React.useState<IUserRequiredFieldsForm>(
    defaultFormValue
  );
  let {userRepo} = repos;
  let {usernames, loading} = usernamesHook;
  if (loading) {
    console.info('attempting to load profile update page ');
    return <Loader />;
  }
  let validation = new UserNameValidation();

  return (
    <Box pad="medium" fill="vertical" justify="start" margin={{top: 'medium'}}>
      <LocalForm
        value={value}
        validate="blur"
        onChange={(v) => setValue({...v})}
        onSubmit={({value}) => {
          console.log('submitting...');
          try {
            userRepo.addUsername(value.username).then(() => {
              history.push('/');
            });
          } catch (e) {
            setValue(defaultFormValue);
            console.error(e);
          }
        }}
      >
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
            value={value.username}
          />
        </FormField>
        <Box direction="row" justify="between">
          <Button type="submit" primary label="Submit" />
        </Box>
      </LocalForm>
    </Box>
  );
}
