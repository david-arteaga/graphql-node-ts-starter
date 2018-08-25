import { BaseService } from './base/base-service';
import { Users } from '../model/models/Users';
import { Injectable } from '../di';
import { WithRequired } from '../utils/TypeUtil';
import { Roles } from '../model/models/Roles';

@Injectable()
export class UserService extends BaseService {
  /**
   * Get all the users in the database
   *
   * @returns an array of all the users in the database
   * @memberof UserService
   */
  async getAllUsers() {
    return (await new this.model.Users().fetchAll()).toJSON() as Users.Type[];
  }

  /**
   * Get a single user's data, including the roles he has
   *
   * @param {string} id the id of the user to search for
   * @returns the user's data
   * @memberof UserService
   */
  async getUserByIdWithRoles(id: string) {
    const userModel = await new this.model.Users({ id }).fetch({
      withRelated: [Users.Related.roles]
    });
    return userModel
      ? (userModel.toJSON() as WithRequired<Users.Type, 'roles'>)
      : null;
  }

  async getUserRoles(user: Users.Type) {
    return await this.model.bookshelf
      .knex('user_roles')
      .select('roleName as name')
      .where('userId', user.id);
  }

  /**
   * Check if a user has a set of given roles identified by name
   *
   * @param {Users.Type} user the user to check
   * @param {string[]} requiredRoleNames the roles that the user must have
   * @returns {Promise<boolean>} whether the user has all the given roles
   * @memberof UserService
   */
  async userHasRoleNames(
    user: Users.Type,
    requiredRoleNames: string[]
  ): Promise<boolean> {
    user.roles =
      user.roles || (await this.getUserByIdWithRoles(user.id))!!.roles!!;

    const userRoleNames = user.roles!!.map(role => role.name);

    return requiredRoleNames.every(role => userRoleNames.indexOf(role) !== -1);
  }
}
