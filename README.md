# Electron ChromeDriver

[![Linux and Mac Build Status](https://circleci.com/gh/electron/chromedriver/tree/master.svg?style=shield)](https://circleci.com/gh/electron/chromedriver/tree/master)
[![Windows Build status](https://ci.appveyor.com/api/projects/status/43safb37jdlaeviw/branch/master?svg=true)](https://ci.appveyor.com/project/electron-bot/chromedriver/branch/master)
<br>
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
[![devDependencies:?](https://img.shields.io/david/electron/chromedriver.svg)](https://david-dm.org/electron/chromedriver)
<br>
[![license:mit](https://img.shields.io/badge/license-mit-blue.svg)](https://opensource.org/licenses/MIT)
[![npm:](https://img.shields.io/npm/v/electron-chromedriver.svg)](https://www.npmjs.com/package/electron-chromedriver)
[![dependencies:?](https://img.shields.io/npm/dm/electron-chromedriver.svg)](https://www.npmjs.com/packages/electron-chromedriver)

Simple node module to download the [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver)
version for [Electron](http://electron.atom.io).

The major version of this library tracks the major version of the Electron
versions released. So if you are using Electron `2.0.x` you would want to use
an `electron-chromedriver` dependency of `~2.0.0` in your `package.json` file.

This library is used by [spectron](https://github.com/electron/spectron).

## Using

```sh
npm install --save-dev electron-chromedriver
chromedriver -h
```

## Custom Mirror

You can set the `ELECTRON_MIRROR` or [`NPM_CONFIG_ELECTRON_MIRROR`](https://docs.npmjs.com/misc/config#environment-variables)
environment variables to use a custom base URL for downloading ChromeDriver zips.

```sh
# Electron mirror for China
ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"

# Local mirror
# Example of requested URL: http://localhost:8080/1.2.0/chromedriver-v2.21-darwin-x64.zip
ELECTRON_MIRROR="http://localhost:8080/"
```

The other environment variables supported by [electron-download](https://www.npmjs.com/package/electron-download)
(`ELECTRON_CUSTOM_DIR`, `ELECTRON_CUSTOM_FILENAME`) are similarly supported.

## Custom Version

By default, this library will download the version of ChromeDriver matching the
version of this library, with fallback to patch version 0 of the same major and
minor version.

You can download a specific version of ChromeDriver instead by setting either an
environment variable or a `.npmrc` config value named `ELECTRON_CHROMEDRIVER_CUSTOM_VERSION`.

You can use this on its own or in combination with the Custom Mirror options.
`ELECTRON_CUSTOM_DIR` and `ELECTRON_CUSTOM_FILENAME` will take precedence over
the dir/filename that would be implied by `ELECTRON_CHROMEDRIVER_CUSTOM_VERSION`.

```sh
# Example of requested URL: https://example.com/builds/7.1.8/no-media-codecs/chromedriver-v7.1.8-win32-x64.zip
ELECTRON_MIRROR="https://example.com/builds/"
ELECTRON_CUSTOM_DIR="7.1.8/no-media-codecs"
ELECTRON_CHROMEDRIVER_CUSTOM_VERSION="7.1.8"
```
