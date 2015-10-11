var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')
var request = require('request')
var unzip = require('unzip')

var config = {
  baseUrl: 'https://github.com/atom/electron/releases/download/',
  // Sync minor version of package to minor version of Electron release
  electron: 'v0.' + require('./package').version.split('.')[1] + '.0',
  outputPath: path.join(__dirname, 'bin'),
  version: 'v2.15'
}

function handleError (error) {
  if (!error) return

  var message = error.message || error
  console.error('Download failed: ' + message)
  process.exit(1)
}


mkdirp(config.outputPath, function (error) {
  if (error) return handleError(error)

  var fileName = 'chromedriver-' + config.version + '-' + process.platform + '-' + process.arch + '.zip'
  var fullUrl = config.baseUrl + config.electron + '/' + fileName
  var requestStream = request.get(fullUrl)
  requestStream.on('error', handleError)

  var zipStream = unzip.Extract({path: config.outputPath})
  zipStream.on('error', handleError)
  zipStream.on('close', function () {
    if (process.platform !== 'win32') {
      fs.chmod(path.join(__dirname, 'bin', 'chromedriver'), '755', handleError)
    }
  })

  requestStream.pipe(zipStream)
})
