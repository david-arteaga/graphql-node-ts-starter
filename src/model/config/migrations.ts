import Knex from 'knex';

export const migrationsConfig: Knex.MigratorConfig = {
  directory: './build/model/migrations',
  tableName: 'migrations'
};

export default migrationsConfig;
