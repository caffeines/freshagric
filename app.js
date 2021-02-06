const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const bindControllersAsync = require('./controllers');
const response = require('./middleware/response');
const config = require('./config');
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

  await bindDatabase();
  await bindControllersAsync(app);
  const port = Number(process.env.PORT) || config.server.port;
  app.listen(port, () => console.log(`server running on port ${port}...`));
};

setupServer().catch((err) => {
  console.log(err);
});
