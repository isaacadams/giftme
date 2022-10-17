import {FirebaseApp, FirebaseDatabase} from '#/config';
import {GetTableType} from '#/database';
import {ref, update, remove} from 'firebase/database';

export const groupInviteTables = (id: string, groupid: string) => [
  `${GetTableType('groups')}/${groupid}/invites/${id}`,
  `${GetTableType('invites')}/${id}/${groupid}`,
];

function isValid(input: string) {
  return !input.isNullOrWhitespace();
}

export class GroupInviteHelper {
  private tables: string[];
  constructor(private id: string, private groupid: string) {
    if (![id, groupid].every(isValid)) {
      console.error('email or groupid was invalid');
      return;
    }

    this.tables = groupInviteTables(id, groupid);
    console.log(this.tables);
  }

  inviteToGroup() {
    let updates = this.tables.reduce((p, c) => {
      p[c] = false;
      return p;
    }, {});

    update(ref(FirebaseDatabase), updates);
  }

  confirmInviteToGroup() {
    let {groupid, id} = this;
    update(ref(FirebaseDatabase), {
      [`${GetTableType('groups')}/${groupid}/members/${id}`]: true,
      [`${GetTableType('users')}/${id}/groups/${groupid}`]: true,
    });

    remove(ref(FirebaseDatabase, `groups/${groupid}/invites/${id}`));
    remove(ref(FirebaseDatabase, `invites/${id}/${groupid}`));
  }

  denyInviteToGroup() {
    let {groupid, id} = this;
    remove(ref(FirebaseDatabase, `groups/${groupid}/invites/${id}`));
    remove(ref(FirebaseDatabase, `invites/${id}/${groupid}`));
  }
}
