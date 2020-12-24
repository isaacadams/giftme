import * as React from 'react';
import {FamilyRepository, FirebaseAppContext, UserRepository} from '@firebase';
import {Box, Text} from 'grommet';
import {Add} from 'grommet-icons';

export function FamilyPage(props) {
  /* let [userRepo, setUserRepo] = React.useState<UserRepository | null>(null);
  let [familyRepo, setFamilyRepo] = React.useState<FamilyRepository | null>(
    null
  );

  let {database, authState} = React.useContext(FirebaseAppContext);
  let {user} = authState;

  React.useEffect(() => {
    setUserRepo(new UserRepository(database));
    setFamilyRepo(new FamilyRepository(database));
  }, [database, user]); */

  //let u = usersRepo.getOne(user.uid);

  return (
    <Box direction="row">
      <Box>
        <Add />
        <Text>Add a Family</Text>
      </Box>
    </Box>
  );
}
