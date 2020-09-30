const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const config = require('../config');
const constants = require('../constants');

const signAsync = Promise.promisify(jwt.sign);
const verifyAsync = Promise.promisify(jwt.verify);

const generateToken = async ({ email, userType }) => {
  const paylaod = { email, userType };
  const { jwtTTL, secret } = config.security;
  const { PUBLIC, INVESTOR } = constants.userType;
  let TTL = jwtTTL;
  if (userType !== PUBLIC && userType !== INVESTOR) TTL = '30min';
  const token = await signAsync(paylaod, secret, { expiresIn: TTL });
  return token;
};

const verifyToken = async (token) => {
  try {
    const payload = await verifyAsync(token, config.security.secret);
    return payload;
  } catch (err) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
