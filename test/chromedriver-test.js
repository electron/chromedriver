const assert = require('assert')
const ChildProcess = require('child_process')
const path = require('path')

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
      assert.equal(output.indexOf('ChromeDriver 2.36'), 0, `Unexpected version: ${output}`)
    })

    chromeDriver.on('error', done)
    chromeDriver.on('close', () => done())
  })
})
