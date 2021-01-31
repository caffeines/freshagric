const auth = require('../../middleware/auth');
const userDao = require('../../data/userDao.js');

module.exports = {
  profile: [
    auth.authenticate,
    async (req, res) => {
      try {
        const user = req.user || req.admin;
        const profile = await userDao.findUserByEmail(user.email);
        res.ok(profile);
      } catch (err) {
        res.serverError(err);
      }
    },
  ],
};
