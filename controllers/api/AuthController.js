const bcrypt = require('bcrypt');
const userDao = require('../../data/userDao.js');
const authValidator = require('../../middleware/validator/auth');
const errorCodes = require('../../constants/errorCodes');
const utils = require('../../lib/utils');
const config = require('../../config');
const jwt = require('../../lib/jwt');
const mailSender = require('../../service/mailer');

const sendVerificationMail = ({ email }, code) => {
  const url = `${config.server.serverLink}/api/auth/verify/${email}?token=${code}`;
  const mail = {
    to: email,
    subject: 'Fresh Agric email verification',
    html: `<h3>Please verify your email</h3> </br>
            <a href="${url}">Verify Email</a>`,
  };
  mailSender(mail);
};

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
            sendVerificationMail(user, code);
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
        const hashPassword = await bcrypt.hash(req.body.password, config.server.saltRound);
        const createdUser = await userDao.createUser({ ...req.body, password: hashPassword });
        sendVerificationMail(createdUser, createdUser.verificationCode);
        res.ok({ title: 'User created successfully' });
      } catch (err) {
        console.log(err);
        res.serverError(err);
      }
    },
  ],
  get_verify_email: [
    async (req, res, email) => {
      const { token } = req.query;
      try {
        const vCode = await userDao.verifyUser(email, token);
        if (vCode === 'notFound') {
          res.notFound({
            title: 'User not found',
            code: errorCodes.USER_NOT_FOUND,
          });
          return;
        }
        if (vCode === 'alreadyVerified') {
          res.badRequest({
            title: 'Email already verified',
            code: errorCodes.EMAIL_ALREADY_VERIFIED,
          });
          return;
        }
        if (vCode === 'doesNotMatch') {
          res.unauthorized({
            title: 'Verification code does not match',
            code: errorCodes.VERIFICATION_CODE_NOT_MATCH,
          });
          return;
        }
        if (vCode === 'expired') {
          res.badRequest({
            title: 'Verification code expired',
            code: errorCodes.VERIFICATION_CODE_EXPIRED,
          });
          return;
        }
        res.ok({
          title: 'Email verification successful',
        });
      } catch (err) {
        console.log(err);
        res.serverError(err);
      }
    },
  ],
  post_login: [
    authValidator.loginValidator,
    async (req, res) => {
      const { email, password } = req.body;
      try {
        const user = await userDao.findUserByEmail(email, true);
        if (!user) {
          res.notFound({
            title: 'User is not registered',
            code: errorCodes.USER_NOT_FOUND,
          });
          return;
        }
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
          sendVerificationMail(user, code);
          res.forbidden({
            title: 'Verify your email',
            code: errorCodes.USER_NOT_VERIFIED,
          });
          return;
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          res.unauthorized({
            title: 'Incorrect password',
            code: errorCodes.INCORRECT_PASSWORD,
          });
          return;
        }
        const token = await jwt.generateToken(user);
        const profile = {
          name: user.name,
          contact: user.contact,
          userType: user.userType,
          email: user.email,
          profilePicture: user.profilePicture,
          address: user.address,
          joinedAt: user.joinedAt,
        };
        res.ok({ data: { profile, token } });
      } catch (err) {
        console.log(err);
        res.serverError(err);
      }
    },
  ],
};
