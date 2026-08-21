/**
 * (c) 2010-present DEMOS plan GmbH.
 *
 * This file is part of the package demosplan,
 * for more information see the license file.
 *
 * All rights reserved
 */

/**
 * Generic webpack config, shared by every addon.
 *
 * Run webpack with this file as `--config`, from within the addon's own
 * directory, and it derives the whole build from that addon's
 * `demosplan-addon.yml` - no addon-local webpack config needed.
 */
module.exports = require('./src/index.js').buildFromYaml()
