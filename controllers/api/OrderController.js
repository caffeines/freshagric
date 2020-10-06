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
        res.ok();
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
        console.log(orderId);

        res.ok();
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
        console.log(req.body);

        const { code, order, orderItems } = await orderDao.create({
          ...req.body,
          userId: req.admin.email,
        });
        console.log(code, order, orderItems);
        if (code === 'notAvailable') {
          res.badRequest({
            title: 'Product not available',
            code: errorCodes.PRODUCT_NOT_AVAILAVLE,
          });
          return;
        }
        res.ok({ order, orderItems });
      } catch (err) {
        console.log(err);
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
