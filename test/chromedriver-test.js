const assert = require('assert')
const ChildProcess = require('child_process')
const path = require('path')
const { version } = require('../package')

const describe = global.describe
const it = global.it

describe('chromedriver binary', function () {
  this.timeout(10000)

  it('launches successfully', done => {
    const args = [
      path.join(__dirname, '..', 'chromedriver.js'),
      '-v'
    ]
    const chromeDriver = ChildProcess.spawn(process.execPath, args)

    let output = ''
    chromeDriver.stdout.on('data', data => output += data)
    chromeDriver.stderr.on('data', data => output += data)

    chromeDriver.on('close', () => {
      if (version.startsWith('3')) {
        assert.equal(output.indexOf('ChromeDriver 2.36'), 0, `Unexpected version: ${output}`)
      } else if (version.startsWith('4')) {
        // see src/chrome/test/chromedriver/embed_version_in_cpp.py
        assert.equal(output.indexOf('ChromeDriver 69.0.3497.106'), 0, `Unexpected version: ${output}`)
      }
    })

    chromeDriver.on('error', done)
    chromeDriver.on('close', () => done())
  })
})
