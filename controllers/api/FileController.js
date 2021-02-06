const S3 = require('../../lib/S3');

module.exports = {
  get_signedRequest: [
    async (req, res) => {
      try {
        const { mimeType } = req.query;
        const signedRequest = await S3.getSignedRequest(mimeType);
        res.ok({ data: signedRequest });
      } catch (err) {
        console.log(err);
        res.serverError(err);
      }
    },
  ],
};
