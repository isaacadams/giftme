import {Repository} from './Repository';

export class Family {
  name: string;
  members: string[];
}

export class FamilyRepository extends Repository<Family> {
  constructor(database: firebase.database.Database) {
    super(database.ref('family'), null);
  }
}
