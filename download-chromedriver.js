const fs = require('fs')
const path = require('path')
const versionToDownload = require('./package').version
const os = require('os');
const { DownloaderHelper } = require('node-downloader-helper')

async function attemptDownload (version) {

    try {
      const targetFolder = path.join(os.homedir(), 'Library/Caches/electron')
      if (fs.existsSync(targetFolder + '/chromedriver-v10.1.5-darwin-x64.zip')) {
        console.log('chromedriver already downloaded!')
      } else {
        const dl = new DownloaderHelper
        ("https://github.com/electron/electron/releases/download/v10.1.5/chromedriver-v10.1.5-darwin-x64.zip", targetFolder)
        dl.on('end', () => console.log('Download Completed'))
        dl.start();
        const platform = process.env.npm_config_platform || process.platform
        if (platform !== 'win32') {
        await fs.chmod(path.join(targetFolder, 'chromedriver-v10.1.5-darwin-x64.zip'), 0o755, () => { console.log('chmod done')})
        }
      }
    } catch(err) {
      console.error(err)
    }
  }

attemptDownload(versionToDownload)
