const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const WebpackAssetsManifest = require('webpack-assets-manifest');

/**
 * Resolve a path relative to the package root directory
 *
 * This function assumes that it is run as part of a node process
 * started from the addon root for the webpack build.
 *
 * @param {String} dir
 * @returns String combined path
 */
function resolve (dir) {
  return path.join(process.cwd(), dir)
}

/**
 * Create a webpack config usable for demosplan-core addons.
 *
 * ## Usage
 *
 * ```js
 * const DemosplanAddon = require('@demos-europe/demosplan-addon')
 *
 * module.exports = DemosplanAddon.build(
 *   'my-addon-name',
 *   { 'MyAddon': DemosPlanAddon.resolve('src/index.js') }
 * )
 * ```
 *
 * @param {String} addon_name kept for call-site compatibility; ES module output has no named global to attach, so it's unused here
 * @param {Object} entrypoints name-mapped entry points dictionary
 * @returns {Options} webpack configuration
 */
function configBuilder(addon_name, entrypoints) {
  const isProduction = process.env.NODE_ENV == 'production'

  /**
   * Transform the entry points object into a usable format
   * so a browser is able to digest the output but still keep
   * the simple webpack config mentioned above to create addons.
   *
   * Basically webpack's EntryDescription object is used to define
   * the library output https://webpack.js.org/concepts/entry-points/#entrydescription-object.
   * Further configuration of library types can be found here https://webpack.js.org/configuration/output/#outputlibrary
   */
  for (const key of Object.keys(entrypoints)) {
    entrypoints[key] = {
      import: entrypoints[key]
    }
    entrypoints[key]['library'] = {
      type: 'module'
    }
  }

  return {
    entry: entrypoints,
    mode: isProduction ? 'production' : 'development',
    experiments: {
      outputModule: true
    },
    output: {
      path: resolve('dist'),
      filename: `[name].esm.js`,
      module: true
    },
    resolve: {
      extensions: ['.js', '.vue']
    },
    devtool: isProduction ? 'nosources-source-map': 'eval-source-map',
    plugins: [
      new MiniCssExtractPlugin(),
      new VueLoaderPlugin(),
      new WebpackAssetsManifest({
        publicPath: true,
        entrypoints: true,
        entrypointsUseAssets: true
      })
    ],
    module: {
      rules: [
        {
          resourceQuery: /blockType=license/,
          loader: path.resolve(__dirname, './removeSFCBlockLoader.js')
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              compatConfig: {
                MODE: 2
              }
            }
          }
        },
        {
          test: /\.(js|jsx)$/i,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postCssOptions: {
                  plugins: [['autoprefixer']],
                }
              }
            }
          ],
        },
        {
          test: /\.(scss|css)$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.scss$/,
          loader: 'sass-loader',
          options: {
            additionalData:
              `@import "@demos-europe/demosplan-ui/tokens/dist/scss/_boxShadow.scss";
              @import "@demos-europe/demosplan-ui/tokens/dist/scss/_breakpoints.scss";
              @import "@demos-europe/demosplan-ui/tokens/dist/scss/_color.palette.scss";
              @import "@demos-europe/demosplan-ui/tokens/dist/scss/_color.data.scss";
              @import "@demos-europe/demosplan-ui/tokens/dist/scss/_color.brand.scss";
              @import "@demos-europe/demosplan-ui/tokens/dist/scss/_color.ui.scss";
              @import "@demos-europe/demosplan-ui/tokens/dist/scss/_fontSize.scss";
              @import "@demos-europe/demosplan-ui/tokens/dist/scss/_rounded.scss";
              @import "@demos-europe/demosplan-ui/tokens/dist/scss/_space.scss";
              @import "@demos-europe/demosplan-ui/tokens/dist/scss/_zIndex.scss";`
          }
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
          type: 'asset',
        },
      ],
    }
  }
}

/**
 * Convert a dot-notated hook key (e.g. `administration.edit.extra.fields`)
 * into the PascalCase directory name addons are expected to use for that
 * hook's components (e.g. `AdministrationEditExtraFields`).
 *
 * @param {String} hookKey
 * @returns {String}
 */
function hookKeyToDirectory (hookKey) {
  return hookKey
    .split('.')
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')
}

/**
 * Derive the webpack entrypoints dictionary from a `demosplan-addon.yml`
 * `ui.hooks` section, following the addon convention of placing hook
 * components at `client/hooks/<PascalCaseHookKey>/<EntryName>.vue`.
 *
 * A hook's `entry` value may list several component names separated by
 * commas (e.g. `entry: AllowedSenderEmailList, AnotherComponent`).
 *
 * @param {Object} hooks the parsed `ui.hooks` section
 * @returns {Object} name-mapped entry points dictionary, as expected by `build()`
 */
function entriesFromHooks (hooks) {
  const entrypoints = {}

  for (const [hookKey, hookConfig] of Object.entries(hooks || {})) {
    const directory = hookKeyToDirectory(hookKey)
    const names = String(hookConfig.entry).split(',').map(name => name.trim())

    for (const name of names) {
      entrypoints[name] = resolve(path.join('client/hooks', directory, `${name}.vue`))
    }
  }

  return entrypoints
}

/**
 * Locate the `@vue/compat` build that vue-loader's `compatConfig` option
 * requires, walking up from the current addon towards the monorepo root
 * where it is expected to be hoisted.
 *
 * @param {String} fromDir
 * @returns {String|null} absolute path to the `@vue/compat` ESM bundle, or null if not found
 */
function resolveVueCompatPath (fromDir) {
  let currentDir = fromDir

  while (currentDir !== path.parse(currentDir).root) {
    const vuePath = path.join(currentDir, 'node_modules/@vue/compat/dist/vue.esm-bundler.js')

    if (fs.existsSync(vuePath)) {
      return vuePath
    }

    currentDir = path.dirname(currentDir)
  }

  return null
}

/**
 * Build a webpack config straight from a `demosplan-addon.yml` file, without
 * requiring the addon to maintain its own webpack config at all.
 *
 * ## Usage
 *
 * Point webpack at this package's own config file instead of an addon-local one:
 *
 * ```
 * webpack --config node_modules/@demos-europe/demosplan-addon-client-builder/webpack.config.js
 * ```
 *
 * run with the addon's directory as the current working directory.
 *
 * @param {String} yamlPath path to `demosplan-addon.yml`, defaults to `./demosplan-addon.yml` relative to cwd
 * @returns {Options} webpack configuration
 */
function buildFromYaml (yamlPath) {
  const resolvedYamlPath = yamlPath || resolve('demosplan-addon.yml')
  const manifest = yaml.load(fs.readFileSync(resolvedYamlPath, 'utf8'))
  const addon = manifest.demosplan_addon || {}
  const hooks = (addon.ui || {}).hooks || {}

  const config = configBuilder(addon.humanName, entriesFromHooks(hooks))

  const vueCompatPath = resolveVueCompatPath(process.cwd())
  if (vueCompatPath) {
    config.resolve.alias = config.resolve.alias || {}
    config.resolve.alias.vue = vueCompatPath
  }

  return config
}

/**
 * Expose a webpack config builder and useful helpers
 * for entrypoint configuration.
 *
 */
const DemosplanAddon = {
  build: configBuilder,
  buildFromYaml: buildFromYaml,
  resolve: resolve
}

module.exports = DemosplanAddon;
