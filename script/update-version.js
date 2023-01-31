const { promises: fs } = require('fs')
const path = require('path')

const versionFormat = /^(\d+\.)(\d+\.)(\d+)$/

const normalizeVersion = (version = '') => {
  return version.startsWith('v') ? version.slice(1) : version
}

async function updateVersion () {
  const version = normalizeVersion(process.argv[2])
  if (!versionFormat.test(version)) {
    console.error(`Unsupported version ${version} - only major, minor, and patch releases are currently supported`)
    return
  }

  const PJ_PATH = path.join(__dirname, '..', 'package.json')
  const pj = require(PJ_PATH)

  const PJLOCK_PATH = path.join(__dirname, '..', 'package-lock.json')
  const pjLock = require(PJLOCK_PATH)

  try {
    pj.version = version
    await fs.writeFile(PJ_PATH, JSON.stringify(pj, null, 2))
    console.log(`Updated package.json version to ${version}`)

    pjLock.version = version
    await fs.writeFile(PJLOCK_PATH, JSON.stringify(pjLock, null, 2))
    console.log(`Updated package-lock.json version to ${version}`)
  } catch (e) {
    console.error('Failed to update chromedriver version: ', e)
    process.exit(1)
  }
}

updateVersion()
