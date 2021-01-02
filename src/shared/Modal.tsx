import React, {useState} from 'react';
import {Layer, Box, Stack} from 'grommet';
import {FormClose} from 'grommet-icons';
import {ChildRenderFunction} from './CustomTypes';

export interface ICustomModalProps {
  children?: ChildRenderFunction<IModalControl>;
}

export interface IModalControl {
  close: () => void;
  open: () => void;
}

export function useModal({
  children,
}: ICustomModalProps): [IModalControl, React.ReactNode] {
  let [show, setShow] = useState(false);
  let modalControl = {close, open};
  return [
    modalControl,
    show && (
      <Layer onEsc={() => setShow(false)} onClickOutside={() => setShow(false)}>
        <Stack anchor="top-right">
          {children(modalControl)}
          <Box onClick={close} style={{boxShadow: 'none'}} pad="small">
            <FormClose />
          </Box>
        </Stack>
      </Layer>
    ),
  ];

  function close() {
    setShow(false);
  }

  function open() {
    setShow(true);
  }
}
