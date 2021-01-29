const auth = require('../../middleware/auth');
const validator = require('../../middleware/validator/order');
const orderDao = require('../../data/orderDao');
const orderItemDao = require('../../data/orderItemDao');
const errorCodes = require('../../constants/errorCodes');
const constants = require('../../constants/index');
const erorrCodes = require('../../constants/errorCodes');

module.exports = {
  get_index: [
    auth.authenticate,
    auth.authorizeAdminOrOwner,
    async (req, res) => {
      try {
        const { page } = req.params;
        const orders = await orderDao.findAll(page);
        res.ok({ data: { orders } });
      } catch (err) {
        console.log(err);
        res.serverError(err);
      }
    },
  ],
  get_index_myOrder: [
    auth.authenticate,
    async (req, res) => {
      try {
        const email = req.user ? req.user.email : req.admin.email;
        const orders = await orderDao.findByUserEmail(email);
        res.ok({ data: orders });
      } catch (err) {
        console.log(err);
        res.serverError(err);
      }
    },
  ],
  get_index_orderId: [
    auth.authenticate,
    validator.validateOrderdUser,
    async (req, res, orderId) => {
      try {
        const orderItems = await orderItemDao.findByOrderId(orderId);
        res.ok({ data: { order: req.order, orderItems } });
      } catch (err) {
        console.log(err);
        res.serverError(err);
      }
    },
  ],
  post: [
    auth.authenticate,
    validator.createOrderValidate,
    async (req, res) => {
      try {
        const { order, orderItems } = await orderDao.create({
          ...req.body,
          userId: req.user ? req.user.email : req.admin.email,
        });
        res.ok({ data: { order, orderItems } });
      } catch (err) {
        console.log(err);
        if (err.message === 'notAvailable') {
          res.badRequest({
            title: 'Product not available',
            code: errorCodes.PRODUCT_NOT_AVAILAVLE,
          });
          return;
        }
        res.serverError(err);
      }
    },
  ],
  patch_cancel_orderId: [
    auth.authenticate,
    validator.validateOrderdUser,
    async (req, res, orderId) => {
      try {
        if (req.order.status === constants.orderStatus.ACCEPTED) {
          res.badRequest({
            title: 'Order already accepted',
            code: erorrCodes.ORDER_ALREADY_ACCEPTED,
          });
          return;
        }
        await orderDao.updateById(orderId, { status: constants.orderStatus.CANCELLED });
        res.ok({ data: { title: 'Order cancelled successfully' } });
      } catch (err) {
        console.log(err);
        res.serverError(err);
      }
    },
  ],
  patch_orderId: [
    auth.authenticate,
    auth.authorizeAdminOrOwner,
    validator.updateOrderValidator,
    async (req, res, orderId) => {
      try {
        const { status } = req.body;
        const order = await orderDao.findById(orderId);
        if (!order) {
          if (!order) {
            res.notFound({
              title: 'Order not found',
              code: erorrCodes.ORDER_NOT_FOUND,
            });
            return;
          }
        }
        if (order.status === constants.orderStatus.CANCELLED) {
          res.badRequest({
            title: 'Order cancelled',
            code: erorrCodes.ORDER_ALREADY_CANCELLED,
          });
          return;
        }
        await orderDao.updateById(orderId, { status });

        res.ok({ data: 'Order status successfully updated' });
      } catch (err) {
        console.log(err);
        res.serverError(err);
      }
    },
  ],
};
