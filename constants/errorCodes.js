module.exports = {
  // NOT FOUND
  USER_NOT_FOUND: 404001,

  // UNAUTHORIZED
  VERIFICATION_CODE_NOT_MATCH: 401001,
  INVALID_TOKEN: 401002,
  NOT_LOGGED_IN: 401003,
  VERIFICATION_CODE_EXPIRED: 401004,
  INCORRECT_PASSWORD: 401005,

  // CONFLICT
  USER_ALREADY_EXITS: 409001,

  // BADREQUEST
  USER_CREATE_INVALID_DATA: 400001,
  EMAIL_VERIFY_INVALID_DATA: 400002,
  USER_EMAIL_NOT_VERIFIED: 400003,
  INVALID_LOGIN_DATA: 400004,
  ORDER_CREATE_INVALID_DATA: 400005,
  USER_UPDATE_INVALID_DATA: 400006,
  EMAIL_ALREADY_VERIFIED: 400007,
  PRODUCT_CREATE_INVALID_DATA: 400008,

  // FORBIDDEN
  USER_NOT_VERIFIED: 403001,
  TOKEN_NOT_FOUND: 403002,
  NOT_ADMIN_OR_OWNER: 403003,

  // SERVER ERROR
  USER_CREATE_SERVER_ERROR: 500001,
  SERVER_ERROR: 500000,
  SESSION_ERROR: 500002,
};
