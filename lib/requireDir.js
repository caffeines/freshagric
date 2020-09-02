/* eslint-disable */
const fs = require('fs');
const path = require('path');

const { resolve } = path;
const { dirname } = path;
const { join } = path;

const requireDir = function (m, dir, option) {
  if (arguments.length === 2) {
    option = arguments[1];
    dir = null;
  }

  option = option || {};
  const config = {
    directory: true,
    directoryLoader: 'recursive',
    ...option,
  };

  dir = !dir ? dirname(m.filename) : resolve(dirname(m.filename), dir);

  const ret = {};

  fs.readdirSync(dir).forEach((fileName) => {
    const filePath = path.join(dir, fileName);
    if (fs.statSync(filePath).isDirectory()) {
      if (config.directory) {
        if (config.directoryLoader === 'recursive') {
          ret[fileName] = requireDir(m, filePath, option);
        } else if (config.directoryLoader === 'module') {
          ret[fileName] = require(filePath);
        } else if (typeof config.directoryLoader === 'function') {
          ret[fileName] = config.directoryLoader(filePath);
        }
      }
    } else if (filePath !== m.filename) {
      const key = fileName.substring(0, fileName.lastIndexOf('.'));
      ret[key] = require(filePath);
    }
  });

  return ret;
};

module.exports = requireDir;
