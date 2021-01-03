import {Box, BoxTypes} from 'grommet';
import React from 'react';

interface IProps extends BoxTypes {
  items: Array<Element>;
  itemProps?: BoxTypes;
}

export function CustomList({items, ...props}: IProps) {
  return (
    <BaseList
      {...props}
      items={items.map((e, i) => ({children: e, props: {}}))}
    />
  );
}

interface IListItem {
  props: BoxTypes;
  children: Element | Element[];
}

interface IListProps extends BoxTypes {
  items: IListItem[];
  itemProps?: BoxTypes;
}

export type Element = JSX.Element | string | React.ReactNode;

export function BaseList({items, itemProps, ...props}: IListProps) {
  return (
    <Box round="xsmall" border height={{min: 'auto'}} {...props}>
      {items.map(({props, children}, i) => (
        <Box
          key={i}
          border={i !== 0 ? {side: 'top'} : undefined}
          pad="small"
          {...itemProps}
          {...props}
        >
          {Array.isArray(children)
            ? [...children].map((c, i) => {
                if (typeof c === 'object') return {...c, key: i};
                return c;
              })
            : children}
        </Box>
      ))}
    </Box>
  );
}
