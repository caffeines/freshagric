const { formatEnv } = require('../lib/utils');

const vars = formatEnv([
  { name: 'SECURITY_SECRET' },
  { name: 'SECURITY_CODE_LENGTH', type: 'number', defaultValue: 20 },
  { name: 'SECURITY_VERIFICATION_CODE_TTL', type: 'number', defaultValue: 60 },
  { name: 'SECURITY_JWT_TTL' },
]);

module.exports = {
  secret: vars.SECURITY_SECRET,
  verificationCodeLength: vars.SECURITY_CODE_LENGTH,
  verificationCodeTTL: vars.SECURITY_VERIFICATION_CODE_TTL,
  jwtTTL: vars.SECURITY_JWT_TTL,
};
