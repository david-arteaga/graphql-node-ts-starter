import Knex from 'knex';

export const seedsConfig: Knex.SeedsConfig = {
  directory: './build/model/migrations/seeds'
};

export default seedsConfig;
