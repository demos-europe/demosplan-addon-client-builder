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
  workDir = setupFixture('addon')
  process.chdir(workDir)
})

after(() => {
  process.chdir(originalCwd)
  fs.rmSync(workDir, { recursive: true, force: true })
})

test('builds a real addon config into a working ESM bundle + manifest', async () => {
  const config = DemosplanAddon.build('test-addon', {
    HelloWorld: DemosplanAddon.resolve('src/HelloWorld.vue')
  })

  const stats = await runWebpack(config)

  assert.equal(stats.hasErrors(), false, stats.toString({ errors: true, colors: false }))

  const distDir = path.join(workDir, 'dist')
  const bundlePath = path.join(distDir, 'HelloWorld.esm.js')
  assert.equal(fs.existsSync(bundlePath), true, 'expected HelloWorld.esm.js to be emitted')

  const bundle = fs.readFileSync(bundlePath, 'utf8')
  assert.match(bundle, /export\s*\{/, 'expected an ES module export statement in the bundle')
  assert.doesNotMatch(bundle, /This block must be stripped/, 'the <license> custom block leaked into the bundle')

  const manifestPath = path.join(distDir, 'assets-manifest.json')
  assert.equal(fs.existsSync(manifestPath), true, 'expected assets-manifest.json to be emitted')

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  assert.equal(manifest['HelloWorld.js'], 'HelloWorld.esm.js')
  assert.deepEqual(manifest.entrypoints.HelloWorld.assets.js, ['HelloWorld.esm.js'])
})
