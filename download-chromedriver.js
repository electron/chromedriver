const { promises: fs } = require('fs')
const path = require('path')
const extractZip = require('extract-zip')
const versionToDownload = require('./package').version
const args = require('minimist')(process.argv.slice(2));
const request = require('request');

async function attemptDownload (version) {
  try {
    const targetFolder = path.join(__dirname, 'bin')
    const zipPath = 'https://chromedriver.storage.googleapis.com/86.0.4240.22/chromedriver_mac64.zip'
    await extractZip(zipPath, { dir: targetFolder })
    const platform = process.env.npm_config_platform || process.platform
    if (platform !== 'win32') {
      await fs.chmod(path.join(targetFolder, 'chromedriver'), 0o755)
    }
  } catch (err) {
    // attempt to fall back to semver minor
    console.log('got to catch block')
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
