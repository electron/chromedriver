const fs = require('fs')
const path = require('path')
const electronDownload = require('electron-download')
const extractZip = require('extract-zip')
const versionToDownload = require('./package').version

function download (version, callback) {
  electronDownload({
    version,
    chromedriver: true,
    platform: process.env.npm_config_platform,
    arch: process.env.npm_config_arch,
    strictSSL: process.env.npm_config_strict_ssl === 'true',
    quiet: ['info', 'verbose', 'silly', 'http'].indexOf(process.env.npm_config_loglevel) === -1
  }, callback)
}

function processDownload (err, zipPath) {
  if (err != null) throw err
  extractZip(zipPath, {dir: path.join(__dirname, 'bin')}, error => {
    if (error != null) throw error
    if (process.platform !== 'win32') {
      fs.chmod(path.join(__dirname, 'bin', 'chromedriver'), '755', error => {
        if (error != null) throw error
      })
    }
  })
}

download(versionToDownload, (err, zipPath) => {
  if (err) {
    const parts = versionToDownload.split('.')
    const baseVersion = `${parts[0]}.${parts[1]}.0`
    download(baseVersion, processDownload)
  } else {
    processDownload(err, zipPath)
  }
})
