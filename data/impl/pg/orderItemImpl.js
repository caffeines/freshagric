const knex = require('../../../lib/knexhelper').getKnexInstance();

module.exports = {
  findByOrderId: async (orderId) => {
    const orderItems = await knex('OrderItems as OI')
      .rightJoin('Products as P', 'P.id', 'OI.productId')
      .select(['P.id as productId', 'OI.quantity', 'P.name', 'slug',
        'category', 'SKU', 'price', 'image', 'unit'])
      .where({ orderId });
    return orderItems;
  },
};
