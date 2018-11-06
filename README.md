# Generate Changelog

[![NPM Version](https://badge.fury.io/js/generate-changelog.svg)](https://www.npmjs.com/package/generate-changelog)
[![Build Status](https://travis-ci.org/lob/generate-changelog.svg)](https://travis-ci.org/lob/generate-changelog)
[![Coverage Status](https://coveralls.io/repos/lob/generate-changelog/badge.svg?branch=master&service=github)](https://coveralls.io/github/lob/generate-changelog?branch=master)
[![Dependency Status](https://david-dm.org/lob/generate-changelog.svg)](https://david-dm.org/lob/generate-changelog)

Generate a changelog from git commits. This is meant to be used so that for every patch, minor, or major version, you update the changelog _prior_ to running `npm version` so that the git tag contains the commit that updated both the changelog and version.

## Installation

You can either install it as a dev dependency to be referenced in your npm scripts, or you can install this module globally to be used for all of your repos on your local machine.

```bash
$ npm i generate-changelog -D # install it as a dev dependency
# OR
$ npm i generate-changelog -g # install it globally
```

## Usage

To use this module, your commit messages have to be in this format:

```
type(category): description [flags]
```

Where `type` is one of the following:

* `breaking`
* `build`
* `ci`
* `chore`
* `docs`
* `feat`
* `fix`
* `other`
* `perf`
* `refactor`
* `revert`
* `style`
* `test`

Where `flags` is an optional comma-separated list of one or more of the following (must be surrounded in square brackets):

* `breaking`: alters `type` to be a breaking change

And `category` can be anything of your choice. If you use a type not found in the list (but it still follows the same format of the message), it'll be grouped under `other`.

### CLI

You can run this module as a CLI app that prepends the new logs to a file (recommended):

```bash
$ changelog -h

  Usage: generate [options]

  Generate a changelog from git commits.

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -p, --patch            create a patch changelog
    -m, --minor            create a minor changelog
    -M, --major            create a major changelog
    -t, --tag <range>      generate from specific tag or range (e.g. v1.2.3 or v1.2.3..v1.2.4)
    -x, --exclude <types>  exclude selected commit types (comma separated)
    -f, --file [file]      file to write to, defaults to ./CHANGELOG.md, use - for stdout
    -u, --repo-url [url]   specify the repo URL for commit links, defaults to checking the package.json
    -a, --allow-unknown    allow unkown commit types
```

It's possible to create a `./CHANGELOG.md` file for a specific commit range:

```bash
generate-changelog 420c945...2a83752
```

Git tags are supported too:

```bash
generate-changelog release/3.1.2822...release/3.1.2858
```

### Code

You can write a script that calls the `generate` function and does whatever you want with the new logs:

```js
var Changelog = require('generate-changelog');
var Fs        = require('fs');

return Changelog.generate({ patch: true, repoUrl: 'https://github.com/lob/generate-changelog' })
.then(function (changelog) {
  Fs.writeFileSync('./CHANGELOG.md', changelog);
});
```

### Recommended

The way that I would recommend using this module would be the way it's being used in this module: as npm scripts. You should install it as a dev dependency and then add the following to the `scripts` object in your `package.json`:

```json
"release:major": "changelog -M && git add CHANGELOG.md && git commit -m 'updated CHANGELOG.md' && npm version major && git push origin && git push origin --tags",
"release:minor": "changelog -m && git add CHANGELOG.md && git commit -m 'updated CHANGELOG.md' && npm version minor && git push origin && git push origin --tags",
"release:patch": "changelog -p && git add CHANGELOG.md && git commit -m 'updated CHANGELOG.md' && npm version patch && git push origin && git push origin --tags",
```

## Testing

To run the test suite, just clone the repository and run the following:

```bash
$ npm i
$ npm test
```

## Contributing

To contribute, please see the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This project is released under the MIT license, which can be found in [`LICENSE.txt`](LICENSE.txt).
