'use strict'

const fs = require('fs')
const all = require('it-all')
const uint8arrayConcat = require('uint8arrays/concat')
const multibase = require('multibase')
const { cidToString } = require('ipfs-core-utils/src/cid')
const { default: parseDuration } = require('parse-duration')
const { coerceCID } = require('../../../utils')

module.exports = {
  command: 'set-data <root> [data]',

  describe: 'Set data field of an ipfs object',

  builder: {
    root: {
      type: 'string',
      coerce: coerceCID
    },
    'cid-base': {
      describe: 'Number base to display CIDs in. Note: specifying a CID base for v0 CIDs will have no effect.',
      type: 'string',
      choices: Object.keys(multibase.names)
    },
    timeout: {
      type: 'string',
      coerce: parseDuration
    }
  },

  /**
   * @param {object} argv
   * @param {import('../../../types').Context} argv.ctx
   * @param {import('cids')} argv.root
   * @param {string} argv.data
   * @param {import('multibase/src/types').BaseName} argv.cidBase
   * @param {number} argv.timeout
   */
  async handler ({ ctx: { ipfs, print, getStdin }, root, data, cidBase, timeout }) {
    let buf

    if (data) {
      buf = fs.readFileSync(data)
    } else {
      buf = uint8arrayConcat(await all(getStdin()))
    }

    const cid = await ipfs.object.patch.setData(root, buf, {
      timeout
    })

    print(cidToString(cid, { base: cidBase, upgrade: false }))
  }
}
