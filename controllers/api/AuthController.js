const userDao = require('../../data/userDao.js');
const authValidator = require('../../middleware/validator/auth');

module.exports = {
  post_register: [
    authValidator.resgisterValidator,
    async (req, res) => {
      try {
        const createdUser = await userDao.createUser(req.body);
        console.log(createdUser);
        res.ok({ data: createdUser });
      } catch (err) {
        console.log(err);
        res.serverError(err);
      }
    },
  ],
};
