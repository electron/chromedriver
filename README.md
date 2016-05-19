# Electron ChromeDriver

[![Linux Build Status](https://travis-ci.org/electron/chromedriver.svg?branch=master)](https://travis-ci.org/kevinsawicki/electron-chromedriver)
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/wg4lulcyqid86d7f/branch/master?svg=true)](https://ci.appveyor.com/project/kevinsawicki/electron-chromedriver/branch/master)
<br>
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
[![devDependencies:?](https://img.shields.io/david/electron/chromedriver.svg)](https://david-dm.org/electron/chromedriver)
<br>
[![license:mit](https://img.shields.io/badge/license-mit-blue.svg)](https://opensource.org/licenses/MIT)
[![npm:](https://img.shields.io/npm/v/electron-chromedriver.svg)](https://www.npmjs.com/packages/electron-chromedriver)
[![dependencies:?](https://img.shields.io/npm/dm/electron-chromedriver.svg)](https://www.npmjs.com/packages/electron-chromedriver)

Simple node module to download the [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver)
version for [Electron](http://electron.atom.io).

This minor version of this library tracks the minor version of the Electron
versions released. So if you are using Electron `1.0.x` you would want to use
an `electron-chromedriver` dependency of `~1.0.0` in your `package.json` file.

This library is used by [spectron](https://github.com/kevinsawicki/spectron).

## Using

```sh
npm install --save-dev electron-chromedriver
chromedriver -h
```
