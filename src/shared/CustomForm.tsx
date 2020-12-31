import {Box, Form, Button, FormProps} from 'grommet';
import React from 'react';

export interface CustomFormProps<T> {
  defaultValue: T;
  formProps: (update: (v: T) => void) => FormProps<T>;
  children?: (value: T) => React.ReactNode;
}

export function CustomForm<T>({
  defaultValue,
  formProps,
  children,
}: CustomFormProps<T>) {
  let [value, setValue] = React.useState<T>(defaultValue);

  return (
    <Form
      {...formProps(setValue)}
      value={value}
      onChange={onChange}
      onReset={() => {
        setValue(defaultValue);
      }}
    >
      {children(value)}
      <Box direction="row" justify="between">
        <Box direction="row" gap="small">
          <Button type="submit" primary label="Submit" />
        </Box>
      </Box>
    </Form>
  );

  function onChange(v: T) {
    setValue({...v});
  }
}
