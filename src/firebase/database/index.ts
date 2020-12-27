import {GiftRepository} from './GiftRepository';
import {UserRepository} from './UserRepository';
import {UserGroupRepository} from './UserGroupRepository';

export type Repositories = {
  loading: boolean;
  giftRepo?: GiftRepository;
  userRepo?: UserRepository;
  userGroupRepo?: UserGroupRepository;
};

export function getRepositories(user: firebase.User): Repositories {
  return {
    loading: !user,
    giftRepo: user && new GiftRepository(user.uid),
    userRepo: user && new UserRepository(user),
    userGroupRepo: user && new UserGroupRepository(user),
  };
}

//export {GiftRepository, UserRepository, UserGroupRepository};
