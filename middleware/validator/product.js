const joi = require('joi');
const erorrCodes = require('../../constants/errorCodes');

const productCreateValidator = (req, res, next) => {
  const schema = joi.object().keys({
    name: joi.string().trim().required(),
    description: joi.string().min(50).max(2000).required(),
    category: joi.string().trim().required(),
    unit: joi.string().trim().required(),
    isPublished: joi.boolean(),
    isOrganic: joi.boolean(),
    image: joi.string().trim().required(),
    cost: joi.number().min(0).required(),
    price: joi.number().min(0).required(),
    maxQuantityCount: joi.number().min(0).required(),
    stock: joi.number().min(1).required(),
  });
  const { value, error } = schema.validate(req.body);
  if (error) {
    res.badRequest({
      title: 'Invalid request data',
      error,
      code: erorrCodes.PRODUCT_CREATE_INVALID_DATA,
    });
    return;
  }
  req.body = value;
  next();
};
module.exports = {
  productCreateValidator,
};
