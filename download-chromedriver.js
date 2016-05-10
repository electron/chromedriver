var Decompress = require('decompress')
var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')
var request = require('request')

var versionSegments = require('./package').version.split('.')

var config = {
  baseUrl: 'https://github.com/atom/electron/releases/download/',
  // Sync minor version of package to minor version of Electron release
  electron: 'v' + versionSegments[0] + '.' + versionSegments[1] + '.0',
  outputPath: path.join(__dirname, 'bin'),
  version: 'v2.15'
}

function handleError (error) {
  if (!error) return

  var message = error.message || error
  console.error('Download failed: ' + message)
  process.exit(1)
}

function unzip (zipped, callback) {
  var decompress = new Decompress()
  decompress.src(zipped)
  decompress.dest(config.outputPath)
  decompress.use(Decompress.zip())
  decompress.run(callback)
}

mkdirp(config.outputPath, function (error) {
  if (error) return handleError(error)

  var fileName = 'chromedriver-' + config.version + '-' + process.platform + '-' + process.arch + '.zip'
  var fullUrl = config.baseUrl + config.electron + '/' + fileName

  request.get({uri: fullUrl, encoding: null}, function (error, response, body) {
    if (error) return handleError(error)
    if (response.statusCode !== 200) return handleError(Error('Non-200 response (' + response.statusCode + ')'))
    unzip(body, function (error) {
      if (error) return handleError(error)
      if (process.platform !== 'win32') {
        fs.chmod(path.join(__dirname, 'bin', 'chromedriver'), '755', handleError)
      }
    })
  })
})
