const knexhelper = require('../lib/knexhelper');
const config = require('../config');

const bindDatabase = async () => {
  knexhelper.configure(config.database);
  const knex = knexhelper.getKnexInstance();
  // wait for knex to connect, verify by executing query
  await knex.raw('SELECT 1;');
  console.log('connected to mysql');
};
module.exports = bindDatabase;
