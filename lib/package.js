'use strict';

var File           = require('./file');
var ParseGitHubUrl = require('github-url-from-git');
var semverInc      = require('semver/functions/inc');

/**
 * Get the package.json object located in the current directory.
 * @returns {Promise<Object>} package.json object
 */
exports.getUserPackage = function () {
  var userPackagePath = process.cwd() + '/package.json';

  return File.exists(userPackagePath)
  .then(function () {
    return require(userPackagePath);
  })
  .catch(function () {
    throw new Error('valid package.json not found');
  });
};

/**
 * Grabs the repository URL if it exists in the package.json.
 * @returns {Promise<String|Null>} the repository URL or null if it doesn't exist
 */
exports.extractRepoUrl = function () {
  return exports.getUserPackage()
  .then(function (userPackage) {
    var url = userPackage.repository && userPackage.repository.url;

    if (typeof url !== 'string') {
      return null;
    }

    if (url.indexOf('github') === -1) {
      return url;
    } else {
      return ParseGitHubUrl(url);
    }
  });
};

/**
 * Calculate the new semver version depending on the options.
 * @param {Object} options - calculation options
 * @param {Boolean} options.patch - whether it should be a patch version
 * @param {Boolean} options.minor - whether it should be a minor version
 * @param {Boolean} options.major - whether it should be a major version
 * @returns {Promise<String>} - new version
 */
exports.calculateNewVersion = function (options) {
  options = options || {};
  return exports.getUserPackage()
  .then(function (userPackage) {
    if (!userPackage.version) {
      return null;
    }

    var releaseType = options.major ? 'major' : options.minor ? 'minor' : options.patch ? 'patch' : options.premajor ? 'premajor' : options.preminor ? 'preminor' : options.prepatch ? 'prepatch' : options.prerelease ? 'prerelease' : '';

    return releaseType ? semverInc(userPackage.version, releaseType, options.preid) : userPackage.version;
  });
};
