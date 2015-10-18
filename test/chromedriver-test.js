var assert = require('assert')
var ChildProcess = require('child_process')
var path = require('path')

var describe = global.describe
var it = global.it

describe('chromedriver binary', function () {
  it('launches successfully', function (done) {
    var command = path.join(__dirname, '..', 'chromedriver.js')
    var args = [
      '-v'
    ]
    var chromeDriver = ChildProcess.spawn(command, args)

    var output = ''
    chromeDriver.stdout.on('data', function (data) { output += data })
    chromeDriver.stderr.on('data', function (data) { output += data })

    chromeDriver.on('close', function () {
      assert.equal(output.indexOf('ChromeDriver 2.16'), 0)
    })

    chromeDriver.on('error', done)
    chromeDriver.on('close', function () { done() })
  })
})
