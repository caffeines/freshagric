const { formatEnv } = require('../lib/utils');

const vars = formatEnv([
  { name: 'SENDGRID_API_KEY' },
  { name: 'SENDGRID_FROM_MAIL' },
]);

module.exports = {
  sendgridApiKey: vars.SENDGRID_API_KEY,
  sendgridFromMail: vars.SENDGRID_FROM_MAIL,
};
