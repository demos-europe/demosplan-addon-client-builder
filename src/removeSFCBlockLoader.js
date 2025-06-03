/**
 * This loader captures any <license> custom block (matched by resourceQuery: /blockType=license/).
 * Without a loader, vue-loader would throw a syntax error when encountering <license> blocks.
 * By returning an empty string here, we remove those blocks, allowing vue-loader to continue without interruption.
 */
module.exports = function (source, map) {
  this.callback(
    null,
    '',
    map
  )
}
