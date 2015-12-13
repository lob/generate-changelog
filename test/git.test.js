'use strict';

var Bluebird = require('bluebird');
var CP       = require('child_process');
var Expect   = require('chai').expect;
var File     = require('fs');
var Sinon    = require('sinon');

var Git = require('../lib/git');

var VALID_COMMITS   = File.readFileSync(__dirname + '/data/git/valid-commits.txt', 'utf-8');
var INVALID_COMMITS = File.readFileSync(__dirname + '/data/git/invalid-commits.txt', 'utf-8');

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

    it('errs if there are no commits yet', function () {
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
        Expect(commits).to.have.length(1);
        Expect(commits[0]).to.have.property('type');
        Expect(commits[0]).to.have.property('category');
        Expect(commits[0]).to.have.property('subject');
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

  });

});
