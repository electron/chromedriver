// Publish the package in the CWD with an OTP code from CFA
const { getOtp } = require('@continuous-auth/client')
const { spawnSync } = require('child_process')

async function publish () {
  const { status } = spawnSync('npm', ['publish', '--otp', await getOtp()])
  process.exit(status)
}

publish()
