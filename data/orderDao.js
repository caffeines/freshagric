const impl = require('./impl/pg/orderImpl');

module.exports = {
  create: async (data) => impl.create(data),
  findByUserEmail: async (email) => impl.findByUserEmail(email),
  findById: async (orderId) => impl.findById(orderId),
  updateById: async (orderId, option) => impl.updateById(orderId, option),
};
