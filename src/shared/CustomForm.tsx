import {Box, Form, Button, FormProps, FormField, FormFieldProps} from 'grommet';
import React from 'react';
import {ChildRenderFunction, Scalar} from './CustomTypes';

export type FormSafeData<T> = {
  [K in keyof T]: T[K] extends Scalar ? NonNullable<T[K]> : never;
};

export interface CustomFormProps<T> {
  showTray?: boolean;
  formProps?: (
    update: (v: FormSafeData<T>) => void
  ) => FormProps<FormSafeData<T>>;
  defaultValue?: FormSafeData<T>;
  children?: ChildRenderFunction<{
    formData: FormSafeData<T>;
    FieldComponent?: React.FunctionComponent<
      ICustomFormFieldProps<FormSafeData<T>, keyof FormSafeData<T>>
    >;
  }>;
}

export function CustomForm<T>({
  defaultValue,
  showTray = false,
  formProps,
  children,
}: CustomFormProps<T>) {
  type D = FormSafeData<T>;
  let [value, setValue] = React.useState<D>(defaultValue);
  let props = formProps ? formProps(setValue) : {};

  const CustomFormField = ({name, fieldProps, children}) => (
    <FormField {...fieldProps} name={name.toString()}>
      {children({name, value: value[name]})}
    </FormField>
  );

  return (
    <>
      <Form
        {...props}
        value={value}
        onChange={onChange}
        onReset={() => {
          setValue(defaultValue);
        }}
      >
        {children({
          formData: value,
          FieldComponent: CustomFormField,
        })}
      </Form>
      {showTray && (
        <Box direction="row" justify="between">
          <Box direction="row" gap="small">
            <Button type="submit" primary label="Submit" />
          </Box>
        </Box>
      )}
    </>
  );

  function onChange(v: D) {
    setValue({...v});
  }
}

interface CustomFormFieldBuilder<T> {
  formData: T;
}

interface ICustomFormFieldProps<T, K extends keyof T> {
  name: K;
  fieldProps?: FormFieldProps;
  children?: ChildRenderFunction<{name: K; value: T[K]}>;
}

/* export function CustomFormField<T, K extends keyof T>({
  formData,
}: CustomFormFieldBuilder<T>): React.FunctionComponent<
  ICustomFormFieldProps<T, K>
> {
  return ({name, fieldProps, children}) => (
    <FormField {...fieldProps} name={name.toString()}>
      {children({name, value: formData[name]})}
    </FormField>
  );
} */

function CheckForKeys(node: React.ReactNode): React.ReactNode {
  if (typeof node !== 'object') return node;

  let children = node['props']['children'];
  if (children.length < 2) return node;
  if (children.every((c) => !!c['key'])) return node;
  return {
    ...node,
    props: {
      ...node['props'],
      children: [...children.map((c, i) => AddKeys(c, i))],
    },
  };
}

function AddKeys(node: React.ReactNode, index: number): React.ReactNode {
  if (typeof node !== 'object') return node;
  return {...node, key: index};
}
