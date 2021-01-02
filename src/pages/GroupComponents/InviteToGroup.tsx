import {searchUsers, Table, UserModel} from '@database';
import {Loader, useDebounce, UserItemView} from '@shared';
import {Box, Button, Heading, Stack, TextInput, Text} from 'grommet';
import {Search} from 'grommet-icons';
import React, {useEffect, useState} from 'react';

// search for existing user to invite
// if none, invite to app
// https://firebase.google.com/docs/auth/web/email-link-auth?authuser=0#completing_sign-in_in_a_web_page
// ^ code to run when users clicks on link in email
// auth.sendSignInLinkToEmail('some@email.com', {url: 'https://giftme-8e917.web.app/', handleCodeInApp: true});

export function InviteToGroup({}) {
  let [selectedUser, setSelectedUser] = useState<UserModel>(null);
  let [delayedQuery, query, setQuery] = useDebounce('', 500);
  let [loading, setLoading] = useState<boolean>(false);
  let [users, setUsers] = useState<Table<UserModel>>({});

  let isSelected = !!selectedUser;

  useEffect(() => {
    if (delayedQuery.isNullOrWhitespace()) {
      setUsers({});
      setLoading(false);
      return;
    }

    searchUsers(delayedQuery, (users) => {
      setUsers(users);
      setLoading(false);
    });
  }, [delayedQuery]);

  return (
    <Box pad="medium">
      <Heading
        alignSelf="center"
        level="4"
        style={{margin: 'none'}}
        textAlign="center"
      >
        Invite member to group
      </Heading>
      <Box gap="small">
        {isSelected ? (
          <UserItemView
            top={selectedUser.displayName}
            bottom={'@' + selectedUser.username}
            pad="small"
          />
        ) : (
          <>
            <Text>begin with '@' to search usernames</Text>
            <Stack anchor="right" fill>
              <TextInput
                height="small"
                placeholder="Invite by full name, username, or email"
                icon={<Search />}
                onChange={(e) => {
                  let v = e.currentTarget.value;
                  if (!loading) setLoading(true);
                  setQuery(v);
                }}
                value={query}
                onSelect={(e) => {
                  console.log(e);
                  setSelectedUser(users[e.suggestion.value])
                }}
                suggestions={Object.keys(users ?? {}).map((k, i) => {
                  let u = users[k];
                  return {
                    label: (
                      <UserItemView
                        key={i}
                        top={u.displayName}
                        bottom={'@' + u.username}
                        pad="small"
                      />
                    ),
                    value: k,
                  };
                })}
              />
              <Box margin={{right: 'small'}}>
                {loading && <Loader size={1} />}
              </Box>
            </Stack>
          </>
        )}
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
