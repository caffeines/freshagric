const joi = require('joi');
const erorrCodes = require('../../constants/errorCodes');

const resgisterValidator = (req, res, next) => {
  const schema = joi.object().keys({
    email: joi.string().trim().email().required(),
    password: joi.string().min(5).max(20).required(),
    name: joi.string().trim().required(),
    contact: joi.string().trim(),
  });
  const { value, error } = schema.validate(req.body);
  if (error) {
    res.badRequest({
      title: 'Invalid request data',
      error,
      code: erorrCodes.USER_CREATE_INVALID_DATA,
    });
    return;
  }
  req.body = value;
  next();
};

const loginValidator = (req, res, next) => {
  const schema = joi.object().keys({
    email: joi.string().trim().email().required(),
    password: joi.string().min(5).max(20).required(),
  });
  const { value, error } = schema.validate(req.body);
  if (error) {
    res.badRequest({
      title: 'Invalid request data',
      error,
      code: erorrCodes.INVALID_LOGIN_DATA,
    });
    return;
  }
  req.body = value;
  next();
};

module.exports = {
  resgisterValidator,
  loginValidator,
};
