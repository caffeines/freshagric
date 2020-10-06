const auth = require('../../middleware/auth');
const validator = require('../../middleware/validator/order');
const orderDao = require('../../data/orderDao');
const errorCodes = require('../../constants/errorCodes');

module.exports = {
  get_index: [
    auth.authenticate,
    auth.authorizeAdminOrOwner,
    async (req, res) => {
      try {
        res.ok();
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
    async (req, res, orderId) => {
      try {
        const { order, orderItems } = await orderDao.findByid(orderId);
        res.ok({ data: { ...order, orderItems } });
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
          userId: req.admin.email,
        });
        res.ok({ data: { order, orderItems } });
      } catch (err) {
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
    async (req, res, orderId) => {
      try {
        console.log(orderId);

        res.ok();
      } catch (err) {
        console.log(err);
        res.serverError(err);
      }
    },
  ],
  patch_orderId: [
    auth.authenticate,
    auth.authorizeAdminOrOwner,
    async (req, res, orderId) => {
      try {
        console.log(orderId);

        res.ok();
      } catch (err) {
        console.log(err);
        res.serverError(err);
      }
    },
  ],
};
