const Redis = require('ioredis');
const config = require('../config/redis');

const protocol = config.ssl ? 'rediss://' : 'redis://';
const redisUrl = `${protocol}:${config.password}@${config.host}:${config.port}`;

let client;
let initFailed = false;
let clientInit = false;

const checkInit = () => (clientInit);

const init = (cb) => {
  client = new Redis(redisUrl);
  client.on('error', (err) => {
    if (!initFailed) {
      initFailed = true;
      cb(err);
    }
  });
  client.on('connect', () => {
    clientInit = true;
    if (checkInit()) cb();
  });
};

const getClients = () => ({ client });

const close = (callback) => {
  client.disconnect();
  setImmediate(callback);
};

module.exports = {
  close,
  getClients,
  init,
  checkInit,
};
