import FirebaseApp from '@config';
import {GetTableType} from '@database';

const rootRef = FirebaseApp.database();

export const groupInviteTables = (id: string, groupid: string) => [
  `${GetTableType('groups')}/${groupid}/invites/${id}`,
  `${GetTableType('invites')}/${id}/${groupid}`,
];

function isValid(input: string) {
  return !input.isNullOrWhitespace();
}

export class GroupInviteHelper {
  private tables: string[];
  constructor(id: string, groupid: string) {
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

    rootRef.ref().update(updates);
  }

  confirmInviteToGroup() {
    let updates = this.tables.reduce((p, c) => {
      p[c] = true;
      return p;
    }, {});

    rootRef.ref().update(updates);
  }

  denyInviteToGroup() {
    this.tables.forEach((t) => rootRef.ref(t).remove());
  }
}
