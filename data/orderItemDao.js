const orderItemImpl = require('./impl/pg/orderItemImpl');

module.exports = {
  findByOrderId: async (orderId) => orderItemImpl.findByOrderId(orderId),
};
