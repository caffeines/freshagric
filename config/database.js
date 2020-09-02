const { formatEnv } = require('../lib/utils');

const vars = formatEnv([
  { name: 'PG_HOST' },
  { name: 'PG_PORT', type: 'number', defaultValue: 3306 },
  { name: 'PG_DATABASE' },
  { name: 'PG_USER' },
  { name: 'PG_PASSWORD' },
  { name: 'PG_POOL_MIN', type: 'number', defaultValue: 2 },
  { name: 'PG_POOL_MAX', type: 'number', defaultValue: 10 },
]);

module.exports = {
  connection: {
    host: vars.PG_HOST,
    port: vars.PG_PORT,
    database: vars.PG_DATABASE,
    user: vars.PG_USER,
    password: vars.PG_PASSWORD,
  },
  pool: {
    min: vars.PG_POOL_MIN,
    max: vars.PG_POOL_MAX,
  },
};