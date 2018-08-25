import Knex from 'knex';

export const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  },
  debug: (process.env.DEBUG_KNEX || '').toLowerCase() === 'true'
};

console.log('knex config', config);

export default config;
