const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const { setupFixture, runWebpack } = require('./support.js')
const DemosplanAddon = require('../src/index.js')

let originalCwd
let workDir

before(() => {
  originalCwd = process.cwd()
  workDir = setupFixture('yaml-addon')
  process.chdir(workDir)
})

after(() => {
  process.chdir(originalCwd)
  fs.rmSync(workDir, { recursive: true, force: true })
})

test('derives entrypoints from demosplan-addon.yml hooks', () => {
  const config = DemosplanAddon.buildFromYaml()

  assert.deepEqual(Object.keys(config.entry).sort(), ['AdditionalSetting', 'FancyImport'])
  assert.equal(
    config.entry.FancyImport.import,
    DemosplanAddon.resolve('client/hooks/ImportTabs/FancyImport.vue')
  )
  assert.equal(
    config.entry.AdditionalSetting.import,
    DemosplanAddon.resolve('client/hooks/AdministrationEditExtraFields/AdditionalSetting.vue')
  )
})

test('the derived config actually builds', async () => {
  const config = DemosplanAddon.buildFromYaml()

  const stats = await runWebpack(config)

  assert.equal(stats.hasErrors(), false, stats.toString({ errors: true, colors: false }))

  const distDir = path.join(workDir, 'dist')
  assert.equal(fs.existsSync(path.join(distDir, 'FancyImport.esm.js')), true)
  assert.equal(fs.existsSync(path.join(distDir, 'AdditionalSetting.esm.js')), true)
})

test('throws when a hook references a component that does not exist', () => {
  const missingEntryDir = setupFixture('yaml-addon-missing-entry')
  process.chdir(missingEntryDir)

  try {
    assert.throws(
      () => DemosplanAddon.buildFromYaml(),
      {
        name: 'SyntaxError',
        message: `Expected to find entrypoint component MissingComponent.vue at ${path.join(missingEntryDir, 'client/hooks/ImportTabs/MissingComponent.vue')}`
      }
    )
  } finally {
    process.chdir(workDir)
    fs.rmSync(missingEntryDir, { recursive: true, force: true })
  }
})
