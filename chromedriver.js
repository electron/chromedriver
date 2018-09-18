#!/usr/bin/env node

var ChildProcess = require('child_process')
var path = require('path')

var command = path.join(__dirname, 'bin', 'chromedriver')
var args = process.argv.slice(2)
var options = {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit'
}

var chromeDriverProcess = ChildProcess.spawn(command, args, options)

chromeDriverProcess.on('close', function (code) {
  if (code !== 0) {
    throw new Error(`chromedriver exit with code ${code}`)
  }
})

chromeDriverProcess.on('error', function (error) {
  throw error
})

var killChromeDriver = function () {
  try {
    chromeDriverProcess.kill()
  } catch (ignored) {
  }
}

process.on('exit', killChromeDriver)
process.on('SIGTERM', killChromeDriver)
