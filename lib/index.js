'use strict';

var Bluebird = require('bluebird');

var Git     = require('./git');
var Package = require('./package');
var Writer  = require('./writer');

/**
 * Generate the changelog.
 * @param {Object} options - generation options
 * @param {Boolean} options.patch - whether it should be a patch changelog
 * @param {Boolean} options.minor - whether it should be a minor changelog
 * @param {Boolean} options.major - whether it should be a major changelog
 * @param {String} options.repoUrl - repo URL that will be used when linking commits
 * @param {Array} options.exclude - exclude listed commit types (e.g. ['chore', 'style', 'refactor'])
 * @returns {Promise<String>} the \n separated changelog string
 */
exports.generate = function (options) {
  return Bluebird.all([
    Package.extractRepoUrl(),
    Package.calculateNewVersion(options),
    Git.getCommits(options)
  ])
  .spread(function (repoUrl, version, commits) {
    options.repoUrl = options.repoUrl || repoUrl;

    return Writer.markdown(version, commits, options);
  });
};
