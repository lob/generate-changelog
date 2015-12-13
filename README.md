# Generate Changelog

[![Build Status](https://travis-ci.org/lob/generate-changelog.svg)](https://travis-ci.org/lob/generate-changelog)
[![Coverage Status](https://coveralls.io/repos/lob/generate-changelog/badge.svg?branch=master&service=github)](https://coveralls.io/github/lob/generate-changelog?branch=master)

Generate a changelog from git commits. This is meant to be used so that for every patch, minor, or major version, you update the changelog, run `npm version`, and then the git tag refers to the commit that updated both the changelog and version.

## Installation

You can either install this module globally to be used for all of your repos on your local machine, or you can install it as a dev dependency to be referenced in your npm scripts.

```bash
$ npm i generate-changelog -g # install it globally
# OR
$ npm i generate-changelog -D # install it as a dev dependency
```

## Usage

To use this module, your commit messages have to be in this format:

```
type(category): description
```

Where `type` is one of the following:

* `chore`
* `docs`
* `feat`
* `fix`
* `refactor`
* `style`
* `test`

And `category` can be anything of your choice.

You can either run this module as a CLI app that prints to stdout (recommended):

```bash
$ changelog -h


  Usage: generate [options]

  Generate a changelog from git commits.

  Options:

    -h, --help            output usage information
    -V, --version         output the version number
    -p, --patch           create a patch changelog
    -m, --minor           create a minor changelog
    -M, --major           create a major changelog
    -u, --repo-url [url]  specify the repo URL for commit links

```

Or you can write a script that calls the `generate` function:

```js
var Changelog = require('generate-changelog');
var File      = require('fs');

return Changelog.generate({ patch: true, repoUrl: 'https://github.com/lob/generate-changelog' })
.then(function (changelog) {
  File.writeFileSync('./CHANGELOG.md', changelog);
});
```

### Recommended

The way that I would recommend using this module would be the way it's being used in this module: as npm scripts. You should install it as a dev dependency and then add the following to the `scripts` object in your `package.json`:

```json
    "changelog:major": "./bin/generate -M >> CHANGELOG.md && git commit -am 'updated CHANGELOG.md' && npm version major && git push origin && git push origin --tags",
    "changelog:minor": "./bin/generate -m >> CHANGELOG.md && git commit -am 'updated CHANGELOG.md' && npm version minor && git push origin && git push origin --tags",
    "changelog:patch": "./bin/generate -p >> CHANGELOG.md && git commit -am 'updated CHANGELOG.md' && npm version patch && git push origin && git push origin --tags",
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
