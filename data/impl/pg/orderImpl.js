const { v4: uuid } = require('uuid');
const constants = require('../../../constants');
const knex = require('../../../lib/knexhelper').getKnexInstance();

module.exports = {
  create: async (data) => {
    try {
      const { items, userId, deliveryAddress } = data;
      const ret = await knex.transaction(async (txn) => {
        const orderItemsObj = {};
        const orderItemsId = [];
        items.forEach((oi) => {
          orderItemsId.push(oi.productId);
          orderItemsObj[oi.productId] = oi;
        });
        const products = await txn('Products').whereIn('id', orderItemsId);

        const totalPrice = products
          .reduce((sum, p) => sum + p.price * orderItemsObj[p.id].quantity, 0);
        const order = {
          userId,
          deliveryAddress,
          totalPrice,
          id: uuid(),
          status: constants.orderStatus.IN_QUEUE,
          createdAt: new Date(),
        };
        await txn('Orders').insert(order);
        const isStockAvailable = (pid) => {
          const idx = products.findIndex((p) => p.id === pid);
          if (idx < 0) {
            return -1;
          }
          const q = orderItemsObj[pid].quantity;
          return products[idx].stock - q >= 0;
        };
        let notAvailable = false;
        const orderItems = [];
        items.forEach((item) => {
          const flag = isStockAvailable(item.productId);
          if (!flag) notAvailable = true;
          if (flag) {
            orderItems.push({
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
            });
          }
        });
        if (notAvailable) {
          await txn.rollback(new Error('notAvailable'));
          return {};
        }
        const promises = [];
        orderItems.forEach(({ quantity, productId }) => {
          const promise = txn('Products')
            .where({ id: productId })
            .decrement('stock', quantity);
          promises.push(promise);
        });
        await txn('OrderItems').insert(orderItems);
        await Promise.all(promises);
        return { order, orderItems };
      });
      return ret;
    } catch (err) {
      return Promise.reject(err);
    }
  },
  findByUserEmail: async (email) => {
    const orders = await knex('Orders as O')
      .join('OrderItems as OI', 'OI.orderId', 'O.id')
      .rightJoin('Products as P', 'P.id', 'OI.productId')
      .select(['O.id as orderId', 'userId', 'O.createdAt', 'O.status as status', 'totalPrice', 'deliveryAddress',
        'P.id as productId', 'OI.quantity', 'P.name', 'slug', 'category', 'SKU', 'price', 'image', 'unit'])
      .where({ userId: email });

    const ret = [];
    const orderMap = {};
    let idx = 0;
    orders.forEach((o) => {
      const {
        orderId, userId, createdAt, status, totalPrice, deliveryAddress, uodatedAt,
        productId, quantity, name, slug, category, SKU, price, image, unit,
      } = o;
      const mapedIdx = orderMap[o.id];
      if (mapedIdx === undefined) {
        orderMap[o.id] = idx;
        ret.push({
          orderId,
          userId,
          createdAt,
          status,
          totalPrice,
          deliveryAddress,
          uodatedAt,
          orderItems: [{
            productId,
            quantity,
            name,
            slug,
            category,
            SKU,
            price,
            image,
            unit,
          }],
        });
        idx += 1;
      } else {
        ret[mapedIdx].orderItems.push({
          productId, quantity, name, slug, category, SKU, price, image, unit,
        });
      }
    });
    return ret;
  },
  findByid: async (orderId) => {
    const [order] = await knex('Orders as O').where({ id: orderId });
    const orderItems = await knex('OrderItems as OI')
      .rightJoin('Products as P', 'P.id', 'OI.productId')
      .select(['P.id as productId', 'OI.quantity', 'P.name', 'slug',
        'category', 'SKU', 'price', 'image', 'unit'])
      .where({ orderId });

    return { order, orderItems };
  },
};
