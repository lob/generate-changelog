### 1.8.0 (2019-06-25)

##### Documentation Changes

* **readme:**  mention commit ranges ([#43](https://github.com/lob/generate-changelog/pull/43)) ([b4a75c49](https://github.com/lob/generate-changelog/commit/b4a75c49c66b265e768c8d6477a409b5e722b8da))

##### New Features

*  Allow unknown commit types ([#46](https://github.com/lob/generate-changelog/pull/46)) ([b2fb9ff5](https://github.com/lob/generate-changelog/commit/b2fb9ff5517b7be309f6050dd7b557b53668e56b))

#### 1.7.1 (2018-03-28)

##### Bug Fixes

* **writer:**  fix commit URL for Gitlab repos ([#40](https://github.com/lob/generate-changelog/pull/40)) ([656a2bcc](https://github.com/lob/generate-changelog/commit/656a2bcc589433cf7f9982e5ca4d0493a56126eb))

### 1.7.0 (2017-12-17)

##### New Features

* **git:**  add support for breaking changes ([#34](https://github.com/lob/generate-changelog/pull/34)) ([d697b273](https://github.com/lob/generate-changelog/commit/d697b27328f72c30d75202dcf87394564849d69d))

##### Bug Fixes

* **writer:**  fix commit URL for BitBucket repos ([#33](https://github.com/lob/generate-changelog/pull/33)) ([0492e91a](https://github.com/lob/generate-changelog/commit/0492e91a846f18ac797e7aeadd366bd753b9dfa2))

### 1.6.0 (2017-11-20)

##### New Features

* **writer:** add links to PRs numbers in commits text ([#31](https://github.com/lob/generate-changelog/pull/31)) ([7015d433](https://github.com/lob/generate-changelog/commit/7015d4330da9c10e32d6d259a89beb096a904c55))

### 1.5.0 (2017-09-20)

##### New Features

* **git:** generate from specific tag (#28) ([cadb4e22](https://github.com/lob/generate-changelog/commit/cadb4e22a20632a7d765a3d97fe9727abb2ce228))

##### Bug Fixes

* **git:** fix error throwing "stdout maxBuffer exceeded" (#29) ([5f515803](https://github.com/lob/generate-changelog/commit/5f515803204d8573b1dfbcf580d44effdb9949ff))

### 1.4.0 (2017-08-29)

##### Chores

* **lint:** update eslint-config-lob ([725beb61](https://github.com/lob/generate-changelog/commit/725beb611965384d1807998dda055fbceb63e937))

##### New Features

* **package:** Add support for missing version (#25) ([7e91a601](https://github.com/lob/generate-changelog/commit/7e91a601f4708c8f03d15bfebb34bcd5eba073dc))

##### Bug Fixes

* **npm:** ignore all unnecessary files in .npmignore ([fe7c3b66](https://github.com/lob/generate-changelog/commit/fe7c3b6643b568739c8ac2b6a326385ddff25fe5))

##### Tests

* **travis:** run against newer versions of node ([f7c3ba9b](https://github.com/lob/generate-changelog/commit/f7c3ba9b52c7ae91808d3408c480e0eef88c30e0))

#### 1.3.1 (2017-08-15)

##### Bug Fixes

* **exclude:** allow arguments to be passed in to -x ([3faf08a6](https://github.com/lob/generate-changelog/commit/3faf08a634449e057f67eaa9c13872f53c8127d0))

### 1.3.0 (2017-06-25)

##### New Features

* **writer:** update commit types ([8945027b](https://github.com/lob/generate-changelog/commit/8945027b693d5653052c031d2ac450250bd6bc41))

##### Bug Fixes

* **writer:** fix the issue with one digit month/days ([bd566622](https://github.com/lob/generate-changelog/commit/bd566622423080c92c531e01fc8d03568bb92740))

#### 1.2.1 (2017-6-13)

##### Bug Fixes

* **exclude:** REALLY exclude listed commit types ([9f836575](https://github.com/lob/generate-changelog/commit/9f8365750af98d1e540543abecc3e4c51d3fbf9a))

### 1.2.0 (2017-6-12)

##### New Features

* **exclude:** add `-x, --exclude` option ([fc31e9a8](https://github.com/lob/generate-changelog/commit/fc31e9a8c69f163d77c995e5bc1bddb10c355258))

##### Bug Fixes

* **writer:** don't print category if empty ([a859a9b6](https://github.com/lob/generate-changelog/commit/a859a9b67d17c88a3adc669fff1f9f999afdb4cc))

##### Tests

* **package:** fix coverage for lib/package.js ([006a2a04](https://github.com/lob/generate-changelog/commit/006a2a04cc3df009d18e7fc99f1cd96a9d108624))

### 1.1.0 (2016-12-15)

##### New Features

* **version:** remove the incrementation flag requirement ([a8b45090](https://github.com/lob/generate-changelog/commit/a8b450901df9a7d0e5817b810ef7de2bcb12b4df))

#### 1.0.2 (2016-6-7)

##### Bug Fixes

* **git:** enfore lowercase commit.type ([d53e497a](https://github.com/lob/generate-changelog/commit/d53e497a69179e9ba2d42416293285f4163c0b97))

#### 1.0.1 (2016-2-10)

##### Documentation Changes

* **readme:** add npm and dependency stats badges ([69d81f66](https://github.com/lob/generate-changelog/commit/69d81f661b73248560d319822ff9d262b42c18b3))

##### Bug Fixes

* **deps:** lockdown eslint-config-lob version ([ee06529c](https://github.com/lob/generate-changelog/commit/ee06529c50b2c0f51878a4861f43ae7aa4bfca0f))
* **writer:** change commit url to use full hash ([40fe02a5](https://github.com/lob/generate-changelog/commit/40fe02a52fc67539b03b5cf1affde1ec4748dc89))

## 1.0.0 (2015-12-14)

##### Documentation Changes

* **npm:** update recommended npm scripts ([2eef1597](https://github.com/lob/generate-changelog/commit/2eef1597))

##### New Features

* **cli:** generate changelog ([c164cff8](https://github.com/lob/generate-changelog/commit/c164cff8))

##### Bug Fixes

* **cli:** prepend to a file instead of printing to stdout ([92e1085d](https://github.com/lob/generate-changelog/commit/92e1085d))
* **writer:** group all uncommon types together ([10caf5f2](https://github.com/lob/generate-changelog/commit/10caf5f2))

