const auth = require('../../middleware/auth');
const validator = require('../../middleware/validator/product');
const productDao = require('../../data/productDao');

module.exports = {
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
  post_index: [
    auth.authenticate,
    auth.authorizeAdminOrOwner,
    validator.productCreateValidator,
    async (req, res) => {
      try {
        const product = await productDao.createProduct({ ...req.body, createdBy: req.admin.email });
        res.ok({ data: product });
      } catch (err) {
        console.log(err);

        res.serverError(err);
      }
    },
  ],
};
