import {
  databaseListenify,
  FirebaseAppContext,
  useQuery,
  UserNameValidation,
} from '@firebase';
import {Loader} from '@shared';
import {Box, Form, FormField, TextInput, Button, Text} from 'grommet';
import React, {useContext} from 'react';

interface IUserRequiredFieldsForm {
  username: string;
}

const defaultFormValue: IUserRequiredFieldsForm = {username: ''};

export function ProfileUpdatePage(props) {
  let [value, setValue] = React.useState<IUserRequiredFieldsForm>(
    defaultFormValue
  );
  let {userRepo} = useContext(FirebaseAppContext).repos;

  let {data: usernames, loading} = useQuery<string[]>(
    [
      {
        key: `usernames`,
        event: 'value',
        cb: (s) => {
          console.log('usernames changed...');
          let d = Object.keys(s.val() ?? {});
          console.log(d);
          return d;
        },
      },
    ],
    ([usernames]) => usernames
  );

  if (loading) return <Loader />;
  console.log('rerendering form...');
  let validation = new UserNameValidation();

  return (
    <Box pad="medium" fill="vertical" justify="start" margin={{top: 'medium'}}>
      <Form
        value={value}
        onChange={({username}) => {
          setValue({username});
        }}
        onSubmit={({value}) => {
          userRepo.addUsername(value['username']);
          setValue(defaultFormValue);
        }}
        validate="blur"
      >
        <FormField
          label="create a username"
          required
          validate={[
            validation.length,
            validation.urlSafe,
            (name) => {
              name = name.trim().toLowerCase();
              console.log(name);
              console.log(usernames);
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
          <Box direction="row" gap="small">
            <Button type="submit" primary label="Submit" />
          </Box>
        </Box>
      </Form>
    </Box>
  );
}
