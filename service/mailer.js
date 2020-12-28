const sgMail = require('@sendgrid/mail');
const config = require('../config');

sgMail.setApiKey(config.sendgrid.sendgridApiKey);

const sendMail = (mail) => {
  sgMail
    .send({
      ...mail,
      from: config.sendgrid.sendgridFromMail,
    })
    .catch((err) => console.error(err));
};
module.exports = sendMail;
