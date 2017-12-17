'use strict';

var Bluebird = require('bluebird');
var CP       = require('child_process');
var Expect   = require('chai').expect;
var Fs       = require('fs');
var Sinon    = require('sinon');

var Git = require('../lib/git');

var VALID_COMMITS   = Fs.readFileSync(__dirname + '/data/git/valid-commits.txt', 'utf-8');
var INVALID_COMMITS = Fs.readFileSync(__dirname + '/data/git/invalid-commits.txt', 'utf-8');

describe('git', function () {

  describe('getCommits', function () {

    it('passes in revisions if there is a previous tag', function () {
      Sinon.stub(CP, 'execAsync')
        .onFirstCall().returns(Bluebird.resolve('v1.2.3'))
        .onSecondCall().returns(Bluebird.resolve(VALID_COMMITS));

      return Git.getCommits()
      .then(function () {
        CP.execAsync.secondCall.calledWithMatch(/HEAD/);
        CP.execAsync.restore();
      });
    });

    it('does not pass in revisions if there are no previous tags', function () {
      Sinon.stub(CP, 'execAsync')
        .onFirstCall().returns(Bluebird.reject())
        .onSecondCall().returns(Bluebird.resolve(VALID_COMMITS));

      return Git.getCommits()
      .then(function () {
        CP.execAsync.secondCall.notCalledWithMatch(/HEAD/);
        CP.execAsync.restore();
      });
    });

    it('uses custom revision range if `-t` / `--tag` option was used', function () {
      Sinon.stub(CP, 'execAsync')
        .onFirstCall().returns(Bluebird.resolve(VALID_COMMITS));

      var tagRange = 'abcdef01..23456789';

      return Git.getCommits({ tag: tagRange })
      .then(function () {
        CP.execAsync.firstCall.calledWithMatch(tagRange);
        CP.execAsync.restore();
      });
    });

    it('errors if there are no commits yet', function () {
      Sinon.stub(CP, 'execAsync')
        .onFirstCall().returns(Bluebird.resolve('v1.2.3'))
        .onSecondCall().returns(Bluebird.reject());

      return Git.getCommits()
      .bind({})
      .catch(function (err) {
        this.err = err;
      })
      .finally(function () {
        Expect(this.err).to.be.instanceof(Error);
        Expect(this.err.message).to.eql('no commits found');
        CP.execAsync.restore();
      });
    });

    it('correctly parses type, category, and subject', function () {
      Sinon.stub(CP, 'execAsync')
        .onFirstCall().returns(Bluebird.resolve('v1.2.3'))
        .onSecondCall().returns(Bluebird.resolve(VALID_COMMITS));

      return Git.getCommits()
      .then(function (commits) {
        Expect(commits).to.have.length(8);
        Expect(commits[0]).to.have.property('type');
        Expect(commits[0]).to.have.property('category');
        Expect(commits[0]).to.have.property('subject');

        CP.execAsync.restore();
      });
    });

    it('correctly applies flags [breaking]', function () {
      Sinon.stub(CP, 'execAsync')
        .onFirstCall().returns(Bluebird.resolve('v1.2.3'))
        .onSecondCall().returns(Bluebird.resolve(VALID_COMMITS));

      return Git.getCommits()
      .then(function (commits) {
        var breakingCommits = commits.filter(function (commit) {
          return commit.type === 'breaking';
        });

        Expect(breakingCommits).to.have.length(2);

        CP.execAsync.restore();
      });
    });

    it('skips malformed commits', function () {
      Sinon.stub(CP, 'execAsync')
        .onFirstCall().returns(Bluebird.resolve('v1.2.3'))
        .onSecondCall().returns(Bluebird.resolve(INVALID_COMMITS));

      return Git.getCommits()
      .then(function (commits) {
        Expect(commits).to.have.length(0);
        CP.execAsync.restore();
      });
    });

    it('skips any excluded commit types', function () {
      Sinon.stub(CP, 'execAsync')
        .onFirstCall().returns(Bluebird.resolve('v1.2.3'))
        .onSecondCall().returns(Bluebird.resolve(VALID_COMMITS));

      return Git.getCommits({ exclude: ['chore', 'style', 'breaking'] })
      .then(function (commits) {
        Expect(commits).to.have.length(4);
        CP.execAsync.restore();
      });
    });

  });

});
