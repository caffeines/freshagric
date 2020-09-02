/* eslint-disable no-param-reassign */
module.exports = (req, res, next) => {
  const responseTypes = {
    ok: '200',
    badRequest: '400',
    unauthorized: '401',
    forbidden: '403',
    notFound: '404',
    serverError: '500',
    conflict: '409',
  };
  Object.keys(responseTypes).forEach((response) => {
    res[response] = (data, opt) => {
      if (!opt || typeof opt !== 'object') opt = {};

      const statusCode = responseTypes[response];

      res.header('X-Platform', 'Fresh Agric');
      res.header('X-Platform-Developer', 'https://freshagric.com');
      res.header('X-Platform-Connect', 'https://freshagric.com');
      res.status(statusCode);
      const { title, code } = data;
      const resJSON = {
        title,
        status: statusCode,
      };
      if (statusCode !== '200' && !code) {
        throw new Error('Error code must be defined');
      }
      if (statusCode !== '200' && statusCode !== '500') {
        resJSON.errors = data.error;
        resJSON.code = code;
      }
      if (statusCode === '200') {
        resJSON.data = data.data;
      }
      if (statusCode === '500') {
        if (process.env.NODE_ENV !== 'production') {
          resJSON.errors = data;
        } else {
          resJSON.errors = 'Something went wrong, try again';
        }
        data.url = req.url;
      }
      res.json(resJSON);
    };
  });
  next();
};
