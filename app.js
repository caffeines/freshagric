const http = require('http');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const expressController = require('express-controller');
const passport = require('passport');
const bodyParser = require('body-parser');
const response = require('./middleware/response');
const knexhelper = require('./lib/knexhelper');
const databaseConfig = require('./config/database');
const config = require('./config');
const redis = require('./lib/redis');
const errorCodes = require('./constants/errorCodes');

const setupServer = async () => {
  const app = express();
  if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === null
    || process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(response);
  app.use(cors());
  await new Promise((resolve, reject) => {
    redis.init((err) => {
      if (err) reject(err);
      else {
        // logger.info('connected to redis');
        console.log('connected to redis');
        resolve();
      }
    });
  });
  const { client: redisClient } = redis.getClients();

  // set up session
  const store = new RedisStore({ client: redisClient });
  const session = expressSession({
    store,
    name: config.session.name,
    secret: config.session.secret,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    cookie: { maxAge: config.session.maxAge },
  });

  app.use(session);
  app.use((req, res, next) => {
    if (!req.session) {
      // logger.error('session store error');
      res.serverError({ message: 'session error' });
      return;
    }
    next();
  });
  const bindControllersAsync = () => new Promise((resolve, reject) => {
    const router = express.Router();
    app.use(router);
    expressController.setDirectory(`${__dirname}/controllers`).bind(router, (err) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        if (process.env.NODE_ENV !== 'test') { console.log('controllers bound successfully'); }
        resolve();
      }
    });
  });
  await bindControllersAsync();

  app.listen(4123, () => console.log('server running on port 4123'));
};

setupServer().catch((err) => {
  console.log(err);
});
