'use strict';

var CLI = require('commander');

var Package = require('../package');

module.exports = CLI
  .description('Generate a changelog from git commits.')
  .version(Package.version)
  .option('-p, --patch', 'create a patch changelog')
  .option('-m, --minor', 'create a minor changelog')
  .option('-M, --major', 'create a major changelog')
  .option('-f, --file [file]', 'file to write to, defaults to ./CHANGELOG.md, use - for stdout', './CHANGELOG.md')
  .option('-u, --repo-url [url]', 'specify the repo URL for commit links, defaults to checking the package.json');
