const assert = require('node:assert')
const { describe, it } = require('node:test')
const { spawnSync } = require('child_process')
const path = require('path')
const { version: releaseVersion } = require('../package')
const { ElectronVersions } = require('@electron/fiddle-core')

function outputHasExpectedVersion(output, version) {
  return output.toString().includes(version)
}

describe('chromedriver binary', () => {
  it('launches successfully', { timeout: 10000 }, async (t) => {
    // Skip when this package is not properly configured for an Electron release
    if (releaseVersion === '0.0.0-development') {
      t.skip()
      return
    }

    // Get the expected release information for this release
    const versions = await ElectronVersions.create()
    const expectedInfo = versions.getReleaseInfo(releaseVersion)

    const { chrome: expectedChromeVersion } = expectedInfo

    // Invoke chormedriver with the flag to output the version
    const { stdout, stderr } = spawnSync(process.execPath, [
      path.join(__dirname, '..', 'chromedriver.js'),
      '-v',
    ])

    assert(
      outputHasExpectedVersion(stdout, expectedChromeVersion) ||
        outputHasExpectedVersion(stderr, expectedChromeVersion),
      `Did not find expected Chromium version: ${expectedChromeVersion}\nstdout:\n---\n${stdout}\n---\nstderr:\n${stderr}\n---`,
    )
  })
})
