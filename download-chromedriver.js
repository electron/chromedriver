var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')
var request = require('request')
var unzip = require('unzip')

var config = {
  outputPath: path.join(__dirname, 'bin', 'chromedriver.zip'),
  version: 'v2.15',
  electron: 'v0.' + require('./package').version.split('.')[1] + '.0',
  baseUrl: 'https://github.com/atom/electron/releases/download/'
}


mkdirp.sync(path.dirname(config.outputPath))

var fullUrl = config.baseUrl + config.electron + '/chromedriver-' + config.version + '-' + process.platform + '-' + process.arch + '.zip'
console.log(fullUrl);
console.log('https://github.com/atom/electron/releases/download/v0.33.0/chromedriver-v2.15-darwin-x64.zip');

request.get(fullUrl).pipe(unzip.Extract({path: path.dirname(config.outputPath)}))
