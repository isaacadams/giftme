import {Box, Form, Button, FormProps} from 'grommet';
import React from 'react';

export interface CustomFormProps<T> {
  showTray?: boolean;
  formProps?: (update: (v: T) => void) => FormProps<T>;
  defaultValue?: T;
  children?: (value: T) => React.ReactNode;
}

export function CustomForm<T>({
  defaultValue,
  showTray = false,
  formProps,
  children,
}: CustomFormProps<T>) {
  let [value, setValue] = React.useState<T>(defaultValue);
  let props = formProps ? formProps(setValue) : {};

  return (
    <Form
      {...props}
      value={value}
      onChange={onChange}
      onReset={() => {
        setValue(defaultValue);
      }}
    >
      {children(value)}
      {showTray &&
      <Box direction="row" justify="between">
        <Box direction="row" gap="small">
          <Button type="submit" primary label="Submit" />
        </Box>
      </Box>
      }
    </Form>
  );

  function onChange(v: T) {
    setValue({...v});
  }
}
