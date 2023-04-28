const { promises: fs } = require('fs')
const path = require('path')
const { downloadArtifact } = require('@electron/get')
const extractZip = require('extract-zip')
const versionToDownload = require('./package').version

function download (version) {
  return downloadArtifact({
    version,
    artifactName: 'chromedriver',
    force: process.env.force_no_cache === 'true',
    cacheRoot: process.env.electron_config_cache,
    platform: process.env.npm_config_platform,
    arch: process.env.npm_config_arch,
    rejectUnauthorized: process.env.npm_config_strict_ssl === 'true',
    quiet: ['info', 'verbose', 'silly', 'http'].indexOf(process.env.npm_config_loglevel) === -1
  })
}

async function attemptDownload (version) {
  // Fall back to latest stable if there is not a stamped version, for tests
  if (version === '0.0.0-development') {
    if (!process.env.ELECTRON_CHROMEDRIVER_STABLE_FALLBACK) {
      console.log('WARNING: chromedriver in development needs the environment variable ELECTRON_CHROMEDRIVER_STABLE_FALLBACK set')
      process.exit(1)
    }

    const { ElectronVersions } = require('@electron/fiddle-core')
    const versions = await ElectronVersions.create(undefined, { ignoreCache: true })
    version = versions.latestStable.version
  }

  try {
    const targetFolder = path.join(__dirname, 'bin')
    const zipPath = await download(version)
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
