const { formatEnv } = require('../lib/utils');

const vars = formatEnv([
  { name: 'REDIS_SSL', type: 'boolean', defaultValue: false },
  { name: 'REDIS_HOST' },
  { name: 'REDIS_PORT', type: 'number', defaultValue: 6379 },
  { name: 'REDIS_PASSWORD' },
]);

module.exports = {
  host: vars.REDIS_HOST,
  port: vars.REDIS_PORT,
  password: vars.REDIS_PASSWORD,
  ssl: vars.REDIS_SSL,
};
