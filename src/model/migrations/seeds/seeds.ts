import Knex from 'knex';
import { Roles } from '../../models/Roles';
import bcrypt from 'bcryptjs';
import { passwordSaltLengthForHash } from '../../../auth/constants';

async function insertIfEmpty(
  knex: Knex,
  tableName: string,
  values: any[],
  returning?: string | string[]
) {
  const [{ count }] = await knex.table(tableName).count('*');
  return Number(count) === 0
    ? await knex.table(tableName).insert(values, returning)
    : false;
}

export function seed(knex: Knex, _: PromiseConstructor) {
  return insertIfEmpty(
    knex,
    'roles',
    Roles.roleNames.map(name => ({ name }))
  ).then(() =>
    insertIfEmpty(
      knex,
      'users',
      [
        {
          email: 'admin@admin.com',
          password: bcrypt.hashSync(
            process.env.ROOT_PASSWORD || 'pass',
            passwordSaltLengthForHash
          ),
          name: 'Admin'
        }
      ],
      'id'
    ).then(
      inserted =>
        inserted
          ? knex.table('user_roles').insert({
              userId: inserted[0],
              roleName: Roles.RoleName.admin
            })
          : false
    )
  );
  // return knex

  //   .table('roles')
  //   .count('*')
  //   .then(([{ count }]: { count: string }[]) => {
  //     return Number(count) === 0
  //       ? knex.table('roles').insert(Roles.roleNames.map(name => ({ name })))
  //       : Promise.resolve();
  //   })

  //   .then(() =>
  //     knex
  //       .table('users')
  //       .count('*')
  //       .then<any>(([{ count }]) => {
  //         return Number(count) === 0 ? Promise.resolve() : Promise.resolve();
  //       })
  //   );
}
// $2a$10$2EZzFSL3Xp.qeslvZW0P0uEW2Cb29Bvuta4aXN700vbHAW5gSH6ga
// $2a$10$dK2D.IyZzinbqwQIqeDFyOczX98NLvqnypvGJqyGGD3I5yXBZkkda
// $2a$10$9ShjZpxHUawlJ1B4vWrIWOKvpZwhBngQSw18USkVU1tQdKfshWVIS
