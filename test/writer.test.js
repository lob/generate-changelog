'use strict';

var MockDate = require('mockdate');

var Expect = require('chai').expect;

var Writer = require('../lib/writer');

var VERSION = '1.2.3';

describe('writer', function () {

  describe('getCommitUrl', function () {

    it('makes a valid URL for a BitBucket repository', function () {
      var url = 'https://bitbucket.org/lob/generate-changelog';
      var commitHash = '1234567890';

      var linkUrl = Writer.getCommitUrl(url, commitHash);
      Expect(linkUrl).to.equal(url + '/commits/' + commitHash);
    });

    it('makes a valid URL for a GitHub repository', function () {
      var url = 'https://github.com/lob/generate-changelog';
      var commitHash = '1234567890';

      var linkUrl = Writer.getCommitUrl(url, commitHash);
      Expect(linkUrl).to.equal(url + '/commit/' + commitHash);
    });

    it('makes a valid URL for a Gitlab repository', function () {
      var url = 'https://gitlab.com/lob/generate-changelog.git';
      var expectedUrl = 'https://gitlab.com/lob/generate-changelog';
      var commitHash = '1234567890';

      var linkUrl = Writer.getCommitUrl(url, commitHash);
      Expect(linkUrl).to.equal(expectedUrl + '/commit/' + commitHash);
    });

  });

  describe('markdown', function () {

    it('makes heading h2 if major version', function () {
      var options = { major: true };

      return Writer.markdown(VERSION, [], options)
      .then(function (changelog) {
        var heading = changelog.split('\n')[0];

        Expect(heading).to.contain('## ' + VERSION);
      });
    });

    it('makes heading h3 if minor version', function () {
      var options = { minor: true };

      return Writer.markdown(VERSION, [], options)
      .then(function (changelog) {
        var heading = changelog.split('\n')[0];

        Expect(heading).to.contain('### ' + VERSION);
      });
    });

    it('makes heading h4 if minor version', function () {
      var options = { patch: true };

      return Writer.markdown(VERSION, [], options)
      .then(function (changelog) {
        var heading = changelog.split('\n')[0];

        Expect(heading).to.contain('#### ' + VERSION);
      });
    });

    it('keeps only the date if no version is specified', function () {

      MockDate.set('Mon Mar 13 2019 07:38:18 GMT+1300');
      var options = { major: true };

      return Writer.markdown(false, [], options)
      .then(function (changelog) {
        var heading = changelog.split('\n')[0];

        Expect(heading).to.equal('## 2019-03-13');
        MockDate.reset();
      });
    });

    it('flushes out a commit type with its full name', function () {
      var commits = [
        { type: 'feat', category: 'testing', subject: 'did some testing', hash: '1234567890' }
      ];

      return Writer.markdown(VERSION, commits, {})
      .then(function (changelog) {
        return changelog.split('\n');
      })
      .filter(function (line) {
        return line.indexOf('#####') > -1;
      })
      .get(0)
      .then(function (line) {
        Expect(line).to.eql('##### New Features');
      });
    });

    it('uses the default type name for uncommon types', function () {
      var commits = [
        { type: 'uncommon', category: 'testing', subject: 'did some testing', hash: '1234567890' }
      ];

      return Writer.markdown(VERSION, commits, {})
      .then(function (changelog) {
        return changelog.split('\n');
      })
      .filter(function (line) {
        return line.indexOf('#####') > -1;
      })
      .get(0)
      .then(function (line) {
        Expect(line).to.eql('##### Other Changes');
      });
    });

    it('groups all uncommon types together', function () {
      var commits = [
        { type: 'uncommon', category: 'testing', subject: 'did some testing', hash: '1234567890' },
        { type: 'unknown', category: 'testing', subject: 'did some more testing', hash: '1234567890' }
      ];

      return Writer.markdown(VERSION, commits, {})
      .then(function (changelog) {
        return changelog.split('\n');
      })
      .filter(function (line) {
        return line.indexOf('#####') > -1;
      })
      .tap(function (lines) {
        Expect(lines).to.have.length(1);
      })
      .map(function (line) {
        Expect(line).to.eql('##### Other Changes');
      });
    });

    it('keeps a commit category on one line if there is only one commit in it', function () {
      var category = 'testing';
      var subject = 'did some testing';
      var commits = [
        { type: 'feat', category: category, subject: subject, hash: '1234567890' }
      ];

      return Writer.markdown(VERSION, commits, {})
      .then(function (changelog) {
        return changelog.split('\n');
      })
      .filter(function (line) {
        return line.indexOf(category) > -1;
      })
      .get(0)
      .then(function (line) {
        var regex = new RegExp('^\\* \\*\\*' + category + ':\\*\\* ' + subject);

        Expect(line).to.match(regex);
      });
    });

    it('breaks a commit category onto its own line if there is more than one commit in it', function () {
      var category = 'testing';
      var commits = [
        { type: 'feat', category: category, subject: 'did some testing', hash: '1234567890' },
        { type: 'feat', category: category, subject: 'did some more testing', hash: '1234567890' }
      ];

      return Writer.markdown(VERSION, commits, {})
      .then(function (changelog) {
        return changelog.split('\n');
      })
      .filter(function (line) {
        return line.indexOf(category) > -1;
      })
      .get(0)
      .then(function (line) {
        var regex = new RegExp('^\\* \\*\\*' + category + ':\\*\\*$');

        Expect(line).to.match(regex);
      });
    });

    it('omits commit category if there was no category defined', function () {
      var hash = '1234567890';
      var commits = [
        { type: 'feat', category: 'testing', subject: 'did some testing', hash: hash },
        { type: 'test', category: '', subject: 'other changes', hash: hash }
      ];

      return Writer.markdown(VERSION, commits, {})
      .then(function (changelog) {
        return changelog.split('\n');
      })
      .filter(function (line) {
        return line.indexOf(hash.slice(0, 8)) > -1;
      })
      .then(function (lines) {
        Expect(lines[0]).to.equal('* **testing:** did some testing (12345678)');
        Expect(lines[1]).to.equal('* other changes (12345678)');
      });
    });

    it('trims the commit hash to only 8 chars', function () {
      var category = 'testing';
      var hash = '1234567890';
      var commits = [
        { type: 'feat', category: category, subject: 'did some testing', hash: hash }
      ];

      return Writer.markdown(VERSION, commits, {})
      .then(function (changelog) {
        return changelog.split('\n');
      })
      .filter(function (line) {
        return line.indexOf(category) > -1;
      })
      .get(0)
      .then(function (line) {
        Expect(line).to.not.contain(hash);
        Expect(line).to.contain(hash.substring(0, 8));
      });
    });

    it('wraps the hash in a link if a repoUrl is provided', function () {
      var category = 'testing';
      var url = 'https://github.com/lob/generate-changelog';
      var commits = [
        { type: 'feat', category: category, subject: 'did some testing', hash: '1234567890' }
      ];

      return Writer.markdown(VERSION, commits, { repoUrl: url })
      .then(function (changelog) {
        return changelog.split('\n');
      })
      .filter(function (line) {
        return line.indexOf(category) > -1;
      })
      .get(0)
      .then(function (line) {
        Expect(line).to.contain(url);
      });
    });

    it('wraps an issue/pr number if a repoUrl is provided', function () {
      var category = 'testing';
      var url = 'https://github.com/lob/generate-changelog';
      var pr = 7;
      var commits = [
        { type: 'feat', category: category, subject: 'Merge pull request #' + pr + 'from some/repo', hash: '1234567890' }
      ];

      return Writer.markdown(VERSION, commits, { repoUrl: url })
      .then(function (changelog) {
        return changelog.split('\n');
      })
      .filter(function (line) {
        return line.indexOf(category) > -1;
      })
      .get(0)
      .then(function (line) {
        Expect(line).to.contain('[#' + pr + '](' + url + '/pull/' + pr + ')');
      });
    });

    it('wraps more than one issue/pr numbers in one commit if a repoUrl is provided', function () {
      var category = 'testing';
      var url = 'https://github.com/lob/generate-changelog';
      var prs = [7, 42];
      var commits = [
        { type: 'feat', category: category, subject: 'fixes (#' + prs[0] + '): added some (#' + prs[1] + ')', hash: '1234567890' }
      ];

      return Writer.markdown(VERSION, commits, { repoUrl: url })
      .then(function (changelog) {
        return changelog.split('\n');
      })
      .filter(function (line) {
        return line.indexOf(category) > -1;
      })
      .get(0)
      .then(function (line) {
        Expect(line).to.contain('[#' + prs[0] + '](' + url + '/pull/' + prs[0] + ')');
        Expect(line).to.contain('[#' + prs[1] + '](' + url + '/pull/' + prs[1] + ')');
      });
    });

    it('has the date formatted correctly', function () {

      MockDate.set('Mon Oct 3 2019 07:38:18 GMT+1300');
      var options = { major: true };

      return Writer.markdown(false, [], options)
      .then(function (changelog) {
        var heading = changelog.split('\n')[0];

        Expect(heading).to.equal('## 2019-10-03');
        MockDate.reset();
      });
    });

  });

});
