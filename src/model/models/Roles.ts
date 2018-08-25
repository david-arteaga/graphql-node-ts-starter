import { bookshelf } from '../bookshelf';

export class Roles extends bookshelf.Model<Roles> {
  get tableName() {
    return 'roles';
  }
  get idAttribute() {
    return 'name';
  }
}

export namespace Roles {
  export enum Related {}
  export type Type = RolesTable;
  export enum RoleName {
    user = 'user',
    admin = 'admin'
  }
  export const roleNames: RoleName[] = [RoleName.user, RoleName.admin];
}

type RolesTable = {
  name: string;
};
