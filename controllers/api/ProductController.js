const auth = require('../../middleware/auth');
const validator = require('../../middleware/validator/product');
const productDao = require('../../data/productDao');

module.exports = {
  get_index: [
    auth.authenticate,
    async (req, res) => {
      res.ok({ data: req.user || req.admin });
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
