const { promises: fs } = require('fs')
const path = require('path')
// const { downloadArtifact } = require('@electron/get')
const extractZip = require('extract-zip')
const versionToDownload = require('./package').version


async function makeRequest (requestOptions, parseResponse) {
  return new Promise((resolve, reject) => {
    request(requestOptions, (err, res, body) => {
      if (!err && res.statusCode >= 200 && res.statusCode < 300) {
        if (parseResponse) {
          const build = JSON.parse(body);
          resolve(build);
        } else {
          resolve(body);
        }
      } else {
        if (args.verbose) {
          console.error('Error occurred while requesting:', requestOptions.url);
          if (parseResponse) {
            try {
              console.log('Error: ', `(status ${res.statusCode})`, err || JSON.parse(res.body), requestOptions);
            } catch (err) {
              console.log('Error: ', `(status ${res.statusCode})`, err || res.body, requestOptions);
            }
          } else {
            console.log('Error: ', `(status ${res.statusCode})`, err || res.body, requestOptions);
          }
        }
        reject(err);
      }
    });
  });
}


async function downloadArtifact (name, buildNum, dest) {
  const chromeDriverUrl = 'https://chromedriver.storage.googleapis.com/86.0.4240.22/chromedriver_linux64.zip';
  const artifacts = await makeRequest({
    method: 'GET',
    url: chromeDriverUrl,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }, true).catch(err => {
    if (args.verbose) {
      console.log('Error calling chrome driver service:', err);
    } else {
      console.error('Error calling chrome driver service to get artifact details');
    }
  });
  const artifactToDownload = artifacts.find(artifact => {
    return (artifact.path === name);
  });
  if (!artifactToDownload) {
    console.log(`Could not find artifact called ${name} to download for build #${buildNum}.`);
    process.exit(1);
  } else {
    console.log(`Downloading ${artifactToDownload.url}.`);
    let downloadError = false;
    await downloadWithRetry(artifactToDownload.url, dest).catch(err => {
      if (args.verbose) {
        console.log(`${artifactToDownload.url} could not be successfully downloaded.  Error was:`, err);
      } else {
        console.log(`${artifactToDownload.url} could not be successfully downloaded.`);
      }
      downloadError = true;
    });
    if (!downloadError) {
      console.log(`Successfully downloaded ${name}.`);
    }
  }
}

function download (version) {
  return downloadArtifact({ version, artifactName: 'chromedriver', platform: process.env.npm_config_platform, arch: process.env.npm_config_arch, rejectUnauthorized: process.env.npm_config_strict_ssl === 'true', quiet: ['info', 'verbose', 'silly', 'http'].indexOf(process.env.npm_config_loglevel) === -1})
}

async function attemptDownload (version) {
  try {
    const targetFolder = path.join(__dirname, 'bin')
    const zipPath = await download(version)
    await extractZip(zipPath, { dir: targetFolder })
    const platform = process.env.npm_config_platform || process.platform
    if (platform !== 'win32') {
      await fs.chmod(path.join(targetFolder, 'chromedriver'), 0o755)
    }
  } catch (err) {
    // attempt to fall back to semver minor
    const parts = version.split('.')
    const baseVersion = `${parts[0]}.${parts[1]}.0`

    // don't recurse infinitely
    if (baseVersion === version) {
      throw err
    } else {
      await attemptDownload(baseVersion)
    }
  }
}

attemptDownload(versionToDownload)
