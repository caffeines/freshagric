const joi = require('joi');
const orderDao = require('../../data/orderDao');
const erorrCodes = require('../../constants/errorCodes');
const constants = require('../../constants/index');

const createOrderValidate = (req, res, next) => {
  const itemsSchema = joi.object().keys({
    productId: joi.string().required(),
    quantity: joi.number().required(),
  });
  const orderSchema = joi.object().keys({
    deliveryAddress: joi.string().trim().required(),
    deliveryArea: joi.string().trim().required(),
    items: joi.array().min(1).items(itemsSchema).required(),
  });
  const { value, error } = orderSchema.validate(req.body);
  if (error) {
    res.badRequest({
      title: 'Invalid request data',
      error,
      code: erorrCodes.ORDER_CREATE_INVALID_DATA,
    });
    return;
  }
  req.body = value;
  next();
};

const validateOrderdUser = async (req, res, next) => {
  const { orderId } = req.params;
  const order = await orderDao.findById(orderId);
  if (!order) {
    res.notFound({
      title: 'Order not found',
      code: erorrCodes.ORDER_NOT_FOUND,
    });
    return;
  }
  req.order = order;
  if (req.admin) {
    next();
    return;
  }
  if (order.userId !== req.user.email) {
    res.forbidden({
      title: 'You aren\'t permit to access this order',
      code: erorrCodes.UNAUTHORIZED_ORDER_ACCESS,
    });
    return;
  }
  next();
};
const updateOrderValidator = (req, res, next) => {
  const schema = joi.object().keys({
    status: joi.string().trim().required(),
  });
  const { value, error } = schema.validate(req.body);
  const status = Object.values(constants.orderStatus);
  const isValid = status.includes(req.body.status);
  if (error || !isValid) {
    res.badRequest({
      title: 'Invalid order status',
      error,
      code: erorrCodes.ORDER_UPDATE_INVALID_STATUS,
    });
    return;
  }
  req.body = value;
  next();
};
module.exports = {
  createOrderValidate,
  validateOrderdUser,
  updateOrderValidator,
};
