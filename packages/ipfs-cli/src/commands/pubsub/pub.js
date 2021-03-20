'use strict'

const { default: parseDuration } = require('parse-duration')

module.exports = {
  command: 'pub <topic> <data>',

  describe: 'Publish data to a topic',

  builder: {
    timeout: {
      type: 'string',
      coerce: parseDuration
    }
  },

  /**
   * @param {object} argv
   * @param {import('../../types').Context} argv.ctx
   * @param {string} argv.topic
   * @param {string} argv.data
   * @param {number} argv.timeout
   */
  async handler ({ ctx: { ipfs }, topic, data, timeout }) {
    await ipfs.pubsub.publish(topic, data, {
      timeout
    })
  }
}
