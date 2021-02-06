const { formatEnv } = require('../lib/utils');

const vars = formatEnv([
  { name: 'AWS_ACCESS_KEY_ID' },
  { name: 'AWS_SECRET_ACCESS_KEY' },
  { name: 'S3_BUCKET' },
  { name: 'S3_SINGNED_URL_TTL', type: 'number', defaultValue: 300 },
  { name: 'S3_FILES_DIRECTORY' },
]);

module.exports = {
  bucket: vars.S3_BUCKET,
  signedUrlTTL: vars.S3_SINGNED_URL_TTL, // seconds
  filesDirectory: vars.S3_FILES_DIRECTORY,
};
