const path = require('path');
const pgConfig = require('./config/database');

const migrationsDir = path.join(__dirname, './database/migrations');
const seedsDir = path.join(__dirname, './database/seeds');

exports[process.env.NODE_ENV] = {
  client: 'pg',
  connection: pgConfig.connection,
  migrations: {
    tableName: 'knex_migrations',
    directory: migrationsDir,
  },
  seeds: {
    tableName: 'knex_migrations',
    directory: seedsDir,
  },
};
