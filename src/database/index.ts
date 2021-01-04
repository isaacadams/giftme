import firebase from 'firebase';
import {GiftRepository} from './GiftRepository';
import {UserRepository} from './UserRepository';

export type Repositories = {
  loading: boolean;
  giftRepo?: GiftRepository;
  userRepo?: UserRepository;
};

export function getRepositories(user: firebase.User): Repositories {
  let repos = user && {
    giftRepo: new GiftRepository(user.uid),
    userRepo: new UserRepository(user),
  };

  return {
    loading: !user,
    ...repos,
  };
}

export * from './GroupInviteHelper';

export * from './GiftRepository';
export * from './UserRepository';
export * from './UserGroupRepository';

export * from './schema';
export * from './useData';
export * from './validation';
export * from './useQuery';

//export {GiftRepository, UserRepository, UserGroupRepository};
