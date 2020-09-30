const auth = require('../../middleware/auth');
const validator = require('../../middleware/validator/product');

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
        res.ok({ data: req.body });
      } catch (err) {
        res.serverError(err);
      }
    },
  ],
};
