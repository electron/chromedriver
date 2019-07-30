const assert = require('assert')
const ChildProcess = require('child_process')
const path = require('path')
const { version } = require('../package')

const describe = global.describe
const it = global.it

const versions = {
  3: 'ChromeDriver 2.36',
  4: 'ChromeDriver 2.40.613160',
  5: 'ChromeDriver 2.45',
  6: 'ChromeDriver 76.0.3809.88'
}

describe('chromedriver binary', function () {
  this.timeout(10000)

  it('launches successfully', done => {
    const args = [
      path.join(__dirname, '..', 'chromedriver.js'),
      '-v'
    ]
    const chromeDriver = ChildProcess.spawn(process.execPath, args)

    let output = ''
    chromeDriver.stdout.on('data', data => { output += data })
    chromeDriver.stderr.on('data', data => { output += data })

    chromeDriver.on('close', () => {
      for (const v in versions) {
        if (version.startsWith(v)) {
          const idx = output.indexOf(versions[v])
          assert.strictEqual(idx, 0, `Unexpected version: ${output}`)
        }
      }
    })

    chromeDriver.on('error', done)
    chromeDriver.on('close', () => done())
  })
})
