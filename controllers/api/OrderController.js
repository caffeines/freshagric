const auth = require('../../middleware/auth');

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
    async (req, res) => {
      try {
        res.ok();
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
