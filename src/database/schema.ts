import {GiftModel} from './GiftRepository';
import {GroupModel} from './UserGroupRepository';
import {UserModel} from './UserRepository';

export type DatabaseModel = {
  users: Table<UserModel>;
  usernames: Table<string>;
  gifts: Table<GiftModel>;
  groups: Table<GroupModel>;
  groupnames: Table<string>;
  invites: Table<Table<boolean>>;
};

export type Table<T> = {[key: string]: T};
export type TableKey = keyof DatabaseModel;
export type TableKeyWithItem<T> = T & {
  key: string;
};

export function GetTableType(key: TableKey): string {
  return key.toString();
}

//let groups = GetTableType('groups');

//type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];
/* export function GetTableType<TObj, TProp extends keyof TObj>(key: keyof TObj): TObj[TProp] {
    return null;
} */
