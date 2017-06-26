'use strict';

var Bluebird = require('bluebird');
var CP       = Bluebird.promisifyAll(require('child_process'));

var SEPARATOR      = '===END===';
var COMMIT_PATTERN = /^(\w*)(\(([\w\$\.\-\* ]*)\))?\: (.*)$/;
var FORMAT         = '%H%n%s%n%b%n' + SEPARATOR;

/**
 * Get all commits from the last tag (or the first commit if no tags).
 * @param {Object} options - calculation options
 * @returns {Promise<Array<Object>>} array of parsed commit objects
 */
exports.getCommits = function (options) {
  options = options || {};
  return CP.execAsync('git describe --tags --abbrev=0')
  .catch(function () {
    return '';
  })
  .then(function (tag) {
    tag = tag.toString().trim();
    var revisions = tag ? tag + '..HEAD' : '';

    return CP.execAsync('git log -E --format=' + FORMAT + ' ' + revisions);
  })
  .catch(function () {
    throw new Error('no commits found');
  })
  .then(function (commits) {
    return commits.split('\n' + SEPARATOR + '\n');
  })
  .map(function (raw) {
    if (!raw) {
      return null;
    }

    var lines = raw.split('\n');
    var commit = {};

    commit.hash = lines.shift();
    commit.subject = lines.shift();
    commit.body = lines.join('\n');

    var parsed = commit.subject.match(COMMIT_PATTERN);

    if (!parsed || !parsed[1] || !parsed[4]) {
      return null;
    }

    commit.type = parsed[1].toLowerCase();
    commit.category = parsed[3] || '';
    commit.subject = parsed[4];

    if (raw.indexOf('BREAKING CHANGE') != -1) {
      commit.type = 'breaking';
    }

    return commit;
  })
  .filter(function (commit) {
    if (!commit) {
      return false;
    }
    return options.exclude ? (options.exclude.indexOf(commit.type) === -1) : true;
  });
};
