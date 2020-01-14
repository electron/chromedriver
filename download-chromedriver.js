const fs = require('fs')
const path = require('path')
const electronDownload = require('electron-download')
const extractZip = require('extract-zip')
const thisPackageVersion = require('./package').version

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
  extractZip(zipPath, { dir: path.join(__dirname, 'bin') }, error => {
    if (error != null) throw error
    if (process.platform !== 'win32') {
      fs.chmod(path.join(__dirname, 'bin', 'chromedriver'), '755', error => {
        if (error != null) throw error
      })
    }
  })
}

let primaryVersion = thisPackageVersion
const parts = primaryVersion.split('.')
let fallbackVersion = `${parts[0]}.${parts[1]}.0`

const versionEnvVar = (
  process.env[`NPM_CONFIG_ELECTRON_CHROMEDRIVER_CUSTOM_VERSION`] ||
  process.env[`npm_config_electron_chromedriver_custom_version`] ||
  process.env[`npm_package_config_electron_chromedriver_custom_version`] ||
  process.env[`ELECTRON_CHROMEDRIVER_CUSTOM_VERSION}`]
)

if (versionEnvVar != null) {
  primaryVersion = versionEnvVar
  fallbackVersion = null
}

download(primaryVersion, (err, zipPath) => {
  if (err && fallbackVersion) {
    download(fallbackVersion, processDownload)
  } else {
    processDownload(err, zipPath)
  }
})
