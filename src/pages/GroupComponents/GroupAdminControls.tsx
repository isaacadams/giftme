import {Text} from 'grommet';
import * as React from 'react';
import {Edit, Trash} from 'grommet-icons';
import {BaseList, useModal} from '#/shared';
import {DeleteGroupView} from './DeleteGroupView';
import {useNavigate} from 'react-router-dom';

export function GroupAdminControls({
  groupname,
  deleteTheGroup,
  onEditButtonClick,
}) {
  let navigate = useNavigate();
  let [modalControl, DeleteModal] = useModal({
    children: ({close, open}) => (
      <DeleteGroupView
        {...{
          groupname,
          close,
          deleteGroup: () => {
            deleteTheGroup();
            navigate('/groups');
          },
        }}
      />
    ),
  });
  return (
    <>
      {DeleteModal}
      <BaseList
        fill="horizontal"
        itemProps={{
          direction: 'row',
          gap: 'small',
          hoverIndicator: true,
          focusIndicator: false,
        }}
        items={[
          {
            children: [
              <Edit size="medium" />,
              <Text size="medium">Edit Group</Text>,
            ],
            props: {
              onClick: (e) => onEditButtonClick(),
            },
          },
          {
            children: [
              <Trash size="medium" />,
              <Text size="medium">Delete Group</Text>,
            ],
            props: {
              onClick: (e) => {
                modalControl.open();
              },
            },
          },
        ]}
      />
    </>
  );
}
