const aws = require('aws-sdk');
const mime = require('mime');
const Promise = require('bluebird');
const config = require('../config');
const utils = require('./utils');

const s3 = new aws.S3();
const { bucket, filesDirectory } = config.S3;
const signGetRequest = async (key) => {
  const params = {
    Bucket: bucket,
    Key: key,
    Expires: config.S3.signedUrlTTL,
  };
  const signUrl = Promise.promisify(s3.getSignedUrl, { context: s3 });
  const signedUrl = await signUrl('getObject', params);
  return signedUrl;
};

const getFileInfo = async (fileKey) => {
  const headObject = Promise.promisify(s3.headObject, { context: s3 });
  const params = {
    Bucket: bucket,
    Key: fileKey,
  };
  try {
    const fileInfo = await headObject(params);
    return fileInfo;
  } catch (err) {
    if (err.statusCode === 404) return null;
    return Promise.reject(err);
  }
};

const verifyFileInfo = async (info) => {
  const fileInfo = await getFileInfo(info.key);
  if (!fileInfo) return false;
  if (fileInfo.ContentType !== info.mimeType || fileInfo.ContentLength !== info.size) {
    return false;
  }
  return true;
};
const getSignedRequest = async (mimeType) => {
  const extension = mime.getExtension(mimeType);
  const fileName = await utils.cryptoRandomString(12);
  const key = `${filesDirectory}/${fileName}.${extension}`;
  const params = {
    Bucket: bucket,
    Key: key,
    Expires: config.S3.signedUrlTTL,
    ContentType: mimeType,
    ACL: 'public-read',
  };

  const signUrl = Promise.promisify(s3.getSignedUrl, { context: s3 });
  const signedUrl = await signUrl('putObject', params);
  return {
    key,
    signedUrl,
  };
};
module.exports = {
  signGetRequest,
  verifyFileInfo,
  getFileInfo,
  getSignedRequest,
};
