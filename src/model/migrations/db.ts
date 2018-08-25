import Knex from 'knex';

/**
\c postgres
drop database if exists graphql;
create database graphql;
\c graphql;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

*/

export function up(knex: Knex, _: PromiseConstructor) {
  return knex.schema

    .createTable('users', table => {
      table
        .string('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));

      table.string('name');

      table.string('email').unique();
      table.string('password');

      table.string('facebookId').unique();
      table.string('facebookToken');
      table.jsonb('facebookData');
    })

    .createTable('roles', table => {
      table.string('name').primary();
    })

    .createTable('user_roles', table => {
      table
        .string('userId')
        .references('users.id')
        .notNullable();
      table
        .string('roleName')
        .references('roles.name')
        .notNullable();
    });
}

export function down(knex: Knex, _: PromiseConstructor) {
  return knex.schema
    .dropTableIfExists('user_roles')
    .dropTableIfExists('roles')
    .dropTableIfExists('users');
}
