'use strict'

/**
 * @param {import("../lib/core").ClientOptions} config
 */
module.exports = config => ({
  get: require('./get')(config),
  stat: require('./stat')(config),
  put: require('./put')(config),
  rm: require('./rm')(config)
})
