import { Roles } from './Roles';
import { bookshelf } from '../bookshelf';

export class Users extends bookshelf.Model<Users> {
  get tableName() {
    return 'users';
  }
  get idAttribute() {
    return 'id';
  }

  roles() {
    return this.belongsToMany(Roles, 'user_roles', 'userId', 'roleName');
  }
}

export namespace Users {
  export enum Related {
    roles = 'roles'
  }
  export type Type = UsersTable;
}

type UsersTable = {
  id: string;
  name: string;

  email: string;
  password: string;

  facebookId: string;
  facebookToken: string;
  facebookData: any;

  roles?: Roles.Type[];
};
