const impl = require('./impl/pg/orderImpl');

module.exports = {
  create: async (data) => impl.create(data),
};
