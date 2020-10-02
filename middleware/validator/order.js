const joi = require('joi');
const erorrCodes = require('../../constants/errorCodes');

const createOrderValidate = (req, res, next) => {
  const itemsSchema = joi.object().keys({
    productId: joi.string().required(),
    quantity: joi.number().required(),
  });
  const orderSchema = joi.object().keys({
    deliveryAddress: joi.string().trim().required(),
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

module.exports = {
  createOrderValidate,
};
