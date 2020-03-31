const fs = require('fs')
const path = require('path')
const { downloadArtifact } = require('@electron/get')
const extractZip = require('extract-zip')
const versionToDownload = require('./package').version

function download (version) {
  return downloadArtifact({
    version,
    artifactName: 'chromedriver',
    platform: process.env.npm_config_platform,
    arch: process.env.npm_config_arch,
    rejectUnauthorized: process.env.npm_config_strict_ssl === 'true',
    quiet: ['info', 'verbose', 'silly', 'http'].indexOf(process.env.npm_config_loglevel) === -1
  })
}

function processDownload (zipPath) {
  extractZip(zipPath, { dir: path.join(__dirname, 'bin') }, error => {
    if (error != null) throw error
    if (process.platform !== 'win32') {
      fs.chmod(path.join(__dirname, 'bin', 'chromedriver'), '755', error => {
        if (error != null) throw error
      })
    }
  })
}

async function attemptDownload (version) {
  try {
    const zipPath = await download(version)
    processDownload(zipPath)
  } catch (err) {
    // attempt to fall back to semver minor
    const parts = version.split('.')
    const baseVersion = `${parts[0]}.${parts[1]}.0`

    // don't recurse infinitely
    if (baseVersion === version) {
      throw err
    } else {
      await attemptDownload(baseVersion)
    }
  }
}

attemptDownload(versionToDownload)
