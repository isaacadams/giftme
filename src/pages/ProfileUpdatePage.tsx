import {FirebaseAppContext, useQuery, UserNameValidation} from '@firebase';
import {Loader} from '@shared';
import {Box, Form, FormField, TextInput, Button, Text} from 'grommet';
import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';

interface IUserRequiredFieldsForm {
  username: string;
}

const defaultFormValue: IUserRequiredFieldsForm = {username: ''};

export function ProfileUpdatePage(props) {
  let [value, setValue] = React.useState<IUserRequiredFieldsForm>(
    defaultFormValue
  );
  let history = useHistory();
  let {userRepo} = useContext(FirebaseAppContext).repos;

  let {data: usernames, loading} = useQuery<string[]>(
    [
      {
        key: `usernames`,
        event: 'value',
        cb: (s) => Object.keys(s.val() ?? {}),
      },
    ],
    ([usernames]) => usernames
  );

  if (loading) return <Loader />;
  let validation = new UserNameValidation();

  return (
    <Box pad="medium" fill="vertical" justify="start" margin={{top: 'medium'}}>
      <Form
        value={value}
        onChange={({username}) => {
          setValue({username});
        }}
        onSubmit={({value}) => {
          userRepo
            .addUsername(value['username'])
            .then(() => {
              history.push('/');
            })
            .catch((e) => {
              setValue(defaultFormValue);
              console.error(e);
            });
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
