const auth = require('../../middleware/auth');

module.exports = {
  get_index: [
    auth.authenticate,
    async (req, res) => {
      res.ok({ data: req.user || req.admin });
    },
  ],
};
