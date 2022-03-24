'use strict';

var Bluebird = require('bluebird');
var Expect   = require('chai').expect;
var Sinon    = require('sinon');

var Package = require('../lib/package');

var CURRENT_DIRECTORY = process.cwd();
var PACKAGE_DIRECTORY = '/test/data/package';

describe('package', function () {

  describe('getUserPackage', function () {

    afterEach(function () {
      process.chdir(CURRENT_DIRECTORY);
    });

    it('pull the package.json from the current directory', function () {
      process.chdir(CURRENT_DIRECTORY + PACKAGE_DIRECTORY + '/valid');

      return Package.getUserPackage()
      .then(function (userPackage) {
        Expect(userPackage.name).to.eql('test');
        Expect(userPackage.version).to.eql('1.0.0');
      });
    });

    it('errs if there is no package.json', function () {
      process.chdir(CURRENT_DIRECTORY + PACKAGE_DIRECTORY);

      return Package.getUserPackage()
      .bind({})
      .catch(function (err) {
        this.err = err;
      })
      .finally(function () {
        Expect(this.err).to.be.instanceof(Error);
        Expect(this.err.message).to.eql('valid package.json not found');
      });
    });

    it('errs if the package.json is invalid', function () {
      process.chdir(CURRENT_DIRECTORY + PACKAGE_DIRECTORY + '/invalid');

      return Package.getUserPackage()
      .bind({})
      .catch(function (err) {
        this.err = err;
      })
      .finally(function () {
        Expect(this.err).to.be.instanceof(Error);
        Expect(this.err.message).to.eql('valid package.json not found');
      });
    });

  });

  describe('extractRepoUrl', function () {

    it('returns null if there is no repo URL', function () {
      var repo = null;

      Sinon.stub(Package, 'getUserPackage').returns(Bluebird.resolve({ repository: repo }));

      return Package.extractRepoUrl()
      .then(function (url) {
        Expect(url).to.be.null;
      })
      .finally(function () {
        Package.getUserPackage.restore();
      });
    });

    it('returns the raw URL if it is not a GitHub URL', function () {
      var repo = { url: 'https://bitbucket.org/lob/generate-changelog' };

      Sinon.stub(Package, 'getUserPackage').returns(Bluebird.resolve({ repository: repo }));

      return Package.extractRepoUrl()
      .then(function (url) {
        Expect(url).to.eql(repo.url);
      })
      .finally(function () {
        Package.getUserPackage.restore();
      });
    });

    it('correctly parses a GitHub URL', function () {
      var parsedUrl = 'https://github.com/lob/generate-changelog';
      var repo = { url: 'git+https://github.com/lob/generate-changelog.git' };

      Sinon.stub(Package, 'getUserPackage').returns(Bluebird.resolve({ repository: repo }));

      return Package.extractRepoUrl()
      .then(function (url) {
        Expect(url).to.eql(parsedUrl);
      })
      .finally(function () {
        Package.getUserPackage.restore();
      });
    });

  });

  describe('calculateNewVersion', function () {

    beforeEach(function () {
      Sinon.stub(Package, 'getUserPackage').returns(Bluebird.resolve({ version: '1.2.3' }));
    });

    afterEach(function () {
      Package.getUserPackage.restore();
    });

    it('bumps the major version if major is true', function () {
      var options = { major: true };

      return Package.calculateNewVersion(options)
      .then(function (version) {
        Expect(version).to.eql('2.0.0');
      });
    });

    it('bumps the minor version if minor is true', function () {
      var options = { minor: true };

      return Package.calculateNewVersion(options)
      .then(function (version) {
        Expect(version).to.eql('1.3.0');
      });
    });

    it('bumps the patch version if patch is true', function () {
      var options = { patch: true };

      return Package.calculateNewVersion(options)
      .then(function (version) {
        Expect(version).to.eql('1.2.4');
      });
    });

    it('bumps the premajor version if premajor is true', function () {
      var options = { premajor: true };

      return Package.calculateNewVersion(options)
      .then(function (version) {
        Expect(version).to.eql('2.0.0-0');
      });
    });

    it('bumps the preminor version if preminor is true', function () {
      var options = { preminor: true };

      return Package.calculateNewVersion(options)
      .then(function (version) {
        Expect(version).to.eql('1.3.0-0');
      });
    });

    it('bumps the prepatch version if prepatch is true', function () {
      var options = { prepatch: true };

      return Package.calculateNewVersion(options)
      .then(function (version) {
        Expect(version).to.eql('1.2.4-0');
      });
    });

    it('bumps the prerelease version if prerelease is true and the preid is a string', function () {
      var options = { prerelease: true, preid: 'alpha' };

      return Package.calculateNewVersion(options)
      .then(function (version) {
        Expect(version).to.eql('1.2.4-alpha.0');
      });
    });

    it('leaves the version untouched if none of three options is true', function () {
      return Package.calculateNewVersion()
      .then(function (version) {
        Expect(version).to.eql('1.2.3');
      });
    });

    it('returns null if no version is specified', function () {
      Package.getUserPackage.restore();
      Sinon.stub(Package, 'getUserPackage').returns(Bluebird.resolve({ version: '' }));

      return Package.calculateNewVersion()
      .then(function (version) {
        Expect(version).to.be.null;
      });
    });

  });

});
