const express = require('express');
const expressController = require('express-controller');

const router = express.Router();

const bindControllersAsync = (app) => new Promise((resolve, reject) => {
  app.use(router);
  router.get('/', (req, res) => {
    res.ok({ health: 'OK' });
  });
  expressController.setDirectory('controllers').bind(router, (err) => {
    if (err) {
      console.error(err);
      reject(err);
    } else {
      if (process.env.NODE_ENV !== 'test') { console.log('controllers bound successfully'); }
      resolve();
    }
  });
});
module.exports = bindControllersAsync;
