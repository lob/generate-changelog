'use strict';

var Bluebird = require('bluebird');
var Fs       = Bluebird.promisifyAll(require('fs'));

var STDOUT_PATH = '-';

/**
 * Resolves if the file exists, rejects otherwise.
 * @param {String} path - path of the file to check
 * @returns {Promise}
 */
exports.exists = function (path) {
  return Fs.statAsync(path);
};

/**
 * Read a files contents if it exists, return the empty string otherwise.
 * @param {String} path - path of the file to read
 * @returns {Promise<String>} contents of the file
 */
exports.readIfExists = function (path) {
  return Fs.readFileAsync(path, 'utf8')
  .catch(function () {
    return '';
  });
};

/**
 * Write the data to the specified file (or to stdout if file is '-').
 * @param {String} path - path of the file to write to or '-' for stdout
 * @param {String|Buffer} data - data to write
 * @returns {Promise}
 */
exports.writeToFile = function (path, data) {
  return Bluebird.resolve()
  .then(function () {
    if (path === STDOUT_PATH) {
      return Fs.writeAsync(process.stdout.fd, data);
    } else {
      return Fs.writeFileAsync(path, data);
    }
  });
};
