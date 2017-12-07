'use strict';

var Expect = require('chai').expect;
var Fs     = require('fs');
var Path   = require('path');
var Sinon  = require('sinon');

var File = require('../lib/file');

var DEFAULT_FILE = './CHANGELOG.md';
var NONEXISTENT = Path.resolve(__dirname, '../fake-file.txt');
var README      = Path.resolve(__dirname, '../README.md');
var STDOUT_FD   = 1;
var STDOUT_PATH = '-';

describe('file', function () {

  describe('exists', function () {

    it('resolves if the file exists', function () {
      return File.exists(README);
    });

    it('rejects if the file does not exist', function () {
      return File.exists(NONEXISTENT)
      .bind({})
      .catch(function (err) {
        this.err = err;
      })
      .finally(function () {
        Expect(this.err).to.not.be.null;
      });
    });

  });

  describe('readIfExists', function () {

    it('returns the contents of the file if it exists', function () {
      return File.readIfExists(README)
      .then(function (contents) {
        Expect(contents).to.contain('Generate Changelog');
      });
    });

    it('returns the empty string if it does not exist', function () {
      return File.readIfExists(NONEXISTENT)
      .then(function (contents) {
        Expect(contents).to.eql('');
      });
    });

  });

  describe('writeToFile', function () {

    it('writes to the file if the path is a normal path', function () {
      var data = 'testing';

      Sinon.stub(Fs, 'writeFileAsync');

      return File.writeToFile(README)
      .then(function () {
        Expect(Fs.writeFileAsync.firstCall.calledWith(README, data));
        Fs.writeFileAsync.restore();
      });
    });

    it('writes to stdout if path is "-"', function () {
      var data = 'testing';

      Sinon.stub(Fs, 'writeAsync');

      return File.writeToFile(STDOUT_PATH)
      .then(function () {
        Expect(Fs.writeAsync.firstCall.calledWith(STDOUT_FD, data));
        Fs.writeAsync.restore();
      });
    });

  });

  describe('normalizePath', function () {

    it('default output, no sub-directory given => CHANGELOG.md in current directory', function () {
      return File.normalizeFilePath(DEFAULT_FILE)
      .then(function (normalizedPath) {
        Expect(normalizedPath).to.eql(DEFAULT_FILE);
      });
    });

    it('default name, with sub-directory given => CHANGELOG.md in sub directory', function () {
      var subDirectory = 'subdirectory';

      return File.normalizeFilePath(DEFAULT_FILE, subDirectory)
      .then(function (normalizedPath) {
        Expect(normalizedPath).to.eql(Path.join(subDirectory, DEFAULT_FILE));
      });
    });

    it('explicit name, no sub-directory given => explicit name in current directory', function () {
      var someFile = 'SOMEFILE.md';

      return File.normalizeFilePath(someFile)
      .then(function (normalizedPath) {
        Expect(normalizedPath).to.eql(someFile);
      });
    });

    it('explicit name, with sub-directory given => explicit name in sub directory', function () {
      var subDirectory = 'subdirectory';
      var someFile = 'SOMEFILE.md';

      return File.normalizeFilePath(someFile, subDirectory)
      .then(function (normalizedPath) {
        Expect(normalizedPath).to.eql(Path.join(subDirectory, someFile));
      });
    });

    it('default name, with deep-sub-directory given => CHANGELOG.md in deep-sub directory', function () {
      var subDirectory = Path.join('path', 'to', 'subdirectory');

      return File.normalizeFilePath(DEFAULT_FILE, subDirectory)
      .then(function (normalizedPath) {
        Expect(normalizedPath).to.eql(Path.join(subDirectory, DEFAULT_FILE));
      });
    });

    it('explicit output path, without sub-directory given => explicit output path', function () {
      var explicitPath = Path.join('path', 'to', DEFAULT_FILE);

      return File.normalizeFilePath(explicitPath)
      .then(function (normalizedPath) {
        Expect(normalizedPath).to.eql(explicitPath);
      });
    });

    it('explicit output path, with sub-directory given => explicit output path', function () {
      var explicitPath = Path.join('path', 'to', DEFAULT_FILE);
      var subDirectory = Path.join('some', 'other', 'directory');

      return File.normalizeFilePath(explicitPath, subDirectory)
      .then(function (normalizedPath) {
        Expect(normalizedPath).to.eql(explicitPath);
      });
    });

  });

});
