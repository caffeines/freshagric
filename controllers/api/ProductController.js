const auth = require('../../middleware/auth');
const validator = require('../../middleware/validator/product');
const productDao = require('../../data/productDao');
const utils = require('../../lib/utils');
const errorCodes = require('../../constants/errorCodes');

module.exports = {
  get_search: [
    async (req, res) => {
      try {
        const { name } = req.query;
        const products = await productDao.searchByName(name);
        res.ok({ data: products });
      } catch (err) {
        console.log(err);
        res.serverError(err);
      }
    },
  ],
  get_index: [
    async (req, res) => {
      try {
        const products = await productDao.getAllProducts();
        res.ok({ data: products });
      } catch (err) {
        console.log(err);
        res.serverError(err);
      }
    },
  ],
  get_index_all: [
    auth.authenticate,
    auth.authorizeAdminOrOwner,
    async (req, res) => {
      try {
        const products = await productDao.getAllProducts(true);
        res.ok({ data: products });
      } catch (err) {
        res.serverError(err);
        console.log(err);
      }
    },
  ],
  post_index: [
    auth.authenticate,
    auth.authorizeAdminOrOwner,
    validator.productCreateValidator,
    async (req, res) => {
      try {
        const product = await productDao.createProduct({ ...req.body, createdBy: req.admin.email });
        res.ok({ data: product });
      } catch (err) {
        const isDuplicate = utils.isAlreadyExist(err);
        if (isDuplicate) {
          res.conflict({
            title: 'Product name already exist',
            code: errorCodes.PRODUCT_ALREADY_EXIST,
          });
          return;
        }
        console.log(err);
        res.serverError(err);
      }
    },
  ],
};
