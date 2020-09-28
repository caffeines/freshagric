const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
// const passport = require('passport');
const bodyParser = require('body-parser');
const bindControllersAsync = require('./controllers');
const response = require('./middleware/response');
const config = require('./config');
const redis = require('./lib/redis');
const bindDatabase = require('./database');

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

  await bindDatabase();
  await bindControllersAsync(app);
  const port = Number(process.env.PORT) || config.server.port;
  app.listen(port, () => console.log(`server running on port ${port}...`));
};

setupServer().catch((err) => {
  console.log(err);
});
