import {Box, Button, Heading, TextInput} from 'grommet';
import {Search} from 'grommet-icons';
import React, {useState} from 'react';

// search for existing user to invite
// if none, invite to app
// https://firebase.google.com/docs/auth/web/email-link-auth?authuser=0#completing_sign-in_in_a_web_page
// ^ code to run when users clicks on link in email
// auth.sendSignInLinkToEmail('some@email.com', {url: 'https://giftme-8e917.web.app/', handleCodeInApp: true});

export function InviteToGroup({}) {
  //let auth = FirebaseApp.auth();
  let [isSelected, setIsSelected] = useState();
  return (
    <Box pad="medium">
      <Heading level="4" style={{margin: 'none'}} textAlign="center">
        Invite member to group
      </Heading>
      <Box gap="small">
        <TextInput
          height="small"
          placeholder="Invite by username or email"
          icon={<Search />}
        />
        <Button
          primary
          label={
            <Box round="xsmall" pad="xsmall" align="center">
              {isSelected ? 'Add user to this group' : 'Select a user above'}
            </Box>
          }
          focusIndicator={false}
          plain
          hoverIndicator
          disabled={!isSelected}
          onClick={() => {}}
        />
      </Box>
    </Box>
  );
}
