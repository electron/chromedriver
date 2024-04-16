const assert = require('assert')
const { spawnSync } = require('child_process')
const path = require('path')
const { version: releaseVersion } = require('../package')
const { ElectronVersions } = require('@electron/fiddle-core')

const describe = global.describe
const it = global.it

function outputHasExpectedVersion (output, version) {
  return output.toString().includes(version)
}

describe('chromedriver binary', () => {
  it('launches successfully', async () => {
    // Get the expected release information for this release
    const versions = await ElectronVersions.create()
    const expectedInfo = versions.getReleaseInfo(releaseVersion)

    assert.notStrictEqual(expectedInfo, undefined, `Could not find Electron release information for release ${releaseVersion}`)

    const { chrome: expectedChromeVersion } = expectedInfo

    // Invoke chormedriver with the flag to output the version
    const { stdout, stderr } = spawnSync(process.execPath, [
      path.join(__dirname, '..', 'chromedriver.js'),
      '-v'
    ])

    assert(
      outputHasExpectedVersion(stdout, expectedChromeVersion) || outputHasExpectedVersion(stderr, expectedChromeVersion),
      `Did not find expected Chromium version: ${expectedChromeVersion}\nstdout:\n---\n${stdout}\n---\nstderr:\n${stderr}\n---`
    )
  })
}).timeout(10000)
