const { promises: fs } = require('fs')
const path = require('path')
const { downloadArtifact } = require('@electron/get')
const extractZip = require('extract-zip')
const versionToDownload = require('./package').version
const os = require('os');

function download (version) {
  console.log('in the download function')
  return downloadArtifact({
    version,
    artifactName: 'chromedriver',
    platform: process.env.npm_config_platform,
    arch: process.env.npm_config_arch,
    rejectUnauthorized: process.env.npm_config_strict_ssl === 'true',
    quiet: ['info', 'verbose', 'silly', 'http'].indexOf(process.env.npm_config_loglevel) === -1
  })
}

async function attemptDownload (version) {
  console.log('does it get here. attempt download function')
  try {
    console.log('in try block')
    const targetFolder = path.join(__dirname, 'bin')
    console.log('target folder is: ')
    console.log(targetFolder)
    const zipPath = path.join(os.homedir(), '/Library/Caches/electron/chromedriver-v11.0.0-beta.18-darwin-x64.zip')
    console.log('zipPath is: ')
    console.log(zipPath)
    await extractZip(zipPath, { dir: targetFolder })
    const platform = process.env.npm_config_platform || process.platform
    if (platform !== 'win32') {
      await fs.chmod(path.join(targetFolder, 'chromedriver'), 0o755)
    }
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