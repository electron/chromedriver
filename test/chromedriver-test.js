var assert = require('assert')
var ChildProcess = require('child_process')
var path = require('path')

var describe = global.describe
var it = global.it

describe('chromedriver binary', function () {
  this.timeout(10000)

  it('launches successfully', function (done) {
    var args = [
      path.join(__dirname, '..', 'chromedriver.js'),
      '-v'
    ]
    var chromeDriver = ChildProcess.spawn(process.execPath, args)

    var output = ''
    chromeDriver.stdout.on('data', function (data) { output += data })
    chromeDriver.stderr.on('data', function (data) { output += data })

    chromeDriver.on('close', function () {
      assert.equal(output.indexOf('ChromeDriver 2.19'), 0)
    })

    chromeDriver.on('error', done)
    chromeDriver.on('close', function () { done() })
  })
})
