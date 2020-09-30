const { verifyToken } = require('../lib/jwt');
const errorCodes = require('../constants/errorCodes');
const constants = require('../constants');

const authenticate = async (req, res, next) => {
  const bearer = req.headers.authorization;
  if (typeof bearer === 'undefined') {
    res.forbidden({
      title: 'Not logged in',
      code: errorCodes.TOKEN_NOT_FOUND,
    });
    return;
  }

  if (typeof bearer !== 'undefined') {
    const [, token] = bearer.split(' ');

    try {
      const payload = await verifyToken(token);
      if (!payload) {
        res.unauthorized({
          title: 'Unauthorized, Please login',
          code: errorCodes.NOT_LOGGED_IN,
        });
        return;
      }
      const { ADMIN, PROFESSOR } = constants.userType;
      if (payload.userType === ADMIN || payload.userType === PROFESSOR) {
        req.admin = payload;
        next();
      } else {
        req.user = payload;
        next();
      }
    } catch (err) {
      console.error(err);
      res.serverError({ message: 'Unauthorized, invalid token' });
    }
  }
};
exports.authenticate = authenticate;

const authorizeAdminOrOwner = (req, res, next) => {
  if (req.admin) {
    next();
    return;
  }
  res.forbidden({
    title: 'You are not authorized',
    code: errorCodes.NOT_ADMIN_OR_OWNER,
  });
};
exports.authorizeAdminOrOwner = authorizeAdminOrOwner;
