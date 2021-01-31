/* eslint-disable no-param-reassign */
const crypto = require('crypto');

const formatValue = (name, type, value) => {
  switch (type) {
    case 'number':
      if (isNaN(value)) { // eslint-disable-line no-restricted-globals
        throw new Error(`${name} must be a number`);
      }
      return Number(value);

    case 'boolean':
      if (value === 'true') return true;
      if (value === 'false') return false;
      throw new Error(`${name} must be true or false`);

    case 'string[]':
      return value.split(',');

    default:
      return value;
  }
};

const formatEnv = (vars) => {
  const formattedVars = {};
  vars.forEach((option) => {
    const defaultOption = {
      isOptional: false,
      type: 'string',
    };
    // eslint-disable-next-line no-param-reassign
    option = { ...defaultOption, ...option };

    const {
      name, type, defaultValue,
    } = option;

    const val = process.env[name];
    if (val === null || val === undefined) {
      if (defaultValue === undefined) {
        throw new Error(`Environment variable ${name} must be defined`);
      }
      formattedVars[name] = defaultValue;
    } else {
      formattedVars[name] = formatValue(name, type, val);
    }
  });
  return formattedVars;
};

exports.formatEnv = formatEnv;

const isAlreadyExist = ({ message }) => message.includes('duplicate key value violates unique constraint');
exports.isAlreadyExist = isAlreadyExist;

const getExpirationTime = (genTime, TTL = 600) => {
  TTL *= 1000;
  const expirationTimestamp = genTime.getTime() + TTL;
  return new Date(expirationTimestamp);
};
exports.getExpirationTime = getExpirationTime;

const cryptoRandomString = (length, options) => {
  const defaultOptions = {
    upperCase: true, lowerCase: true, numeric: true,
  };

  // eslint-disable-next-line no-param-reassign
  options = options || {};
  // eslint-disable-next-line no-param-reassign
  options = { ...defaultOptions, ...options };

  let chars = '';
  if (options.lowerCase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (options.upperCase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.numeric) chars += '0123456789';

  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buffer) => {
      if (err) reject(err);
      const len = chars.length;
      const ret = [];
      for (let i = 0; i < length; i += 1) {
        ret[i] = chars.charAt(buffer[i] % len);
      }
      resolve(ret.join(''));
    });
  });
};
exports.cryptoRandomString = cryptoRandomString;
