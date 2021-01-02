import React, {useState} from 'react';
import {Layer, Grid, Box, Heading, Button, Text} from 'grommet';
import {ChildRenderFunction} from './CustomTypes';

interface IProps {
  title?: string;
  prompt: string;
  confirmation?: () => void;
}

export function useModal({title, prompt, confirmation}: IProps) {
  let [show, setShow] = useState(false);

  return {
    show,
    setShow,
    Modal: show && (
      <Layer onEsc={() => setShow(false)} onClickOutside={() => setShow(false)}>
        <Grid>
          {title && (
            <Box direction="row" fill="horizontal" justify="start">
              <Heading margin="small" size="20">
                {title}
              </Heading>
            </Box>
          )}
          <Box pad="medium" direction="row" fill="horizontal">
            <Text>{prompt}</Text>
          </Box>
          <Box direction="row" fill="horizontal" justify="end">
            <Box margin="small">
              <Button label="cancel" onClick={() => setShow(false)} />
            </Box>
            <Box margin="small">
              <Button
                label="ok"
                onClick={(e) => {
                  confirmation();
                  setShow(false);
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Layer>
    ),
  };
}
