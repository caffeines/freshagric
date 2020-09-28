const userDao = require('../../data/userDao.js');
const authValidator = require('../../middleware/validator/auth');
const errorCodes = require('../../constants/errorCodes');
const utils = require('../../lib/utils');
const config = require('../../config');

module.exports = {
  post_register: [
    authValidator.resgisterValidator,
    async (req, res) => {
      try {
        const user = await userDao.findUserByEmail(req.body.email, true);
        if (user) {
          if (!user.isVerified) {
            const expiresAt = utils.getExpirationTime(
              user.verificationCodeGeneratedAt, config.security.verificationCodeTTL,
            );
            const isPending = expiresAt > new Date();
            if (isPending) {
              res.forbidden({
                title: 'Verify your email',
                code: errorCodes.USER_NOT_VERIFIED,
              });
              return;
            }
            const code = await userDao.updateVerificationCode(user.email);
            console.log(code);
            // TODO: Send email later
            res.forbidden({
              title: 'Verify your email',
              code: errorCodes.USER_NOT_VERIFIED,
            });
            return;
          }
          res.conflict({
            title: 'User already exist',
            code: errorCodes.USER_ALREADY_EXITS,
          });
          return;
        }
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
