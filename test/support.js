const fs = require('node:fs')
const path = require('node:path')
const webpack = require('webpack')

// Built under the repo root (not test/) so node's default `--test` file
// discovery never mistakes build output for a test file, and so node_modules
// resolution (which walks up from cwd) still finds this package's deps.
const RUN_ROOT = path.join(__dirname, '../.tmp-test')

function setupFixture (fixtureName) {
  const workDir = path.join(RUN_ROOT, fixtureName)
  fs.rmSync(workDir, { recursive: true, force: true })
  fs.mkdirSync(workDir, { recursive: true })
  fs.cpSync(path.join(__dirname, 'fixtures', fixtureName), workDir, { recursive: true })
  return workDir
}

function runWebpack (config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        return reject(err)
      }
      resolve(stats)
    })
  })
}

module.exports = { RUN_ROOT, setupFixture, runWebpack }
