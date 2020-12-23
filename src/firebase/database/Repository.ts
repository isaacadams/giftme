export interface IRepository<T> {
  getAll(): firebase.database.Reference;
  getOne(key: string): firebase.database.Reference;
  create(
    data: T
  ): Promise<firebase.database.Reference | firebase.database.ThenableReference>;
  update(key: string, data: T): Promise<any>;
  remove(key: string): Promise<any>;
  removeAll(): Promise<any>;
  table: firebase.database.Reference;
}

type Rule<T> = (data: T) => Promise<any>;

export class Repository<T> implements IRepository<T> {
  table: firebase.database.Reference;
  rules: Rule<T>[];
  constructor(table: firebase.database.Reference, rules?: Rule<T>[]) {
    this.table = table;
    console.log(this.table);
    this.rules = rules;
  }

  getAll(): firebase.database.Reference {
    return this.table;
  }

  getOne(key: string): firebase.database.Reference {
    return this.table.child(key);
  }

  create(
    data: T
  ): Promise<
    firebase.database.Reference | firebase.database.ThenableReference
  > {
    return Promise.all(this.rules.map((r) => r(data))).then(() => {
      return this.table.push(data);
    });
  }

  update(key: string, data: T): Promise<any> {
    return this.table.child(key)?.update(data);
  }

  remove(key: string): Promise<any> {
    return this.table.child(key)?.remove();
  }

  removeAll(): Promise<any> {
    return this.table.remove();
  }
}
