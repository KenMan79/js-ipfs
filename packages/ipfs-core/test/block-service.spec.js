/* eslint-env mocha */
'use strict'

const { expect } = require('aegir/utils/chai')

const IpldBlock = require('ipld-block')
const range = require('lodash.range')
const all = require('it-all')
const rawCodec = require('multiformats/codecs/raw')
const { sha256 } = require('multiformats/hashes/sha2')
const CID = require('multiformats/cid')
const uint8ArrayFromString = require('uint8arrays/from-string')
const drain = require('it-drain')
const asLegacyCid = require('ipfs-core-utils/src/as-legacy-cid')

// This gets replaced by `create-repo-browser.js` in the browser
const createTempRepo = require('./utils/create-repo-nodejs.js')

/**
 * @typedef {import('ipfs-repo')} IPFSRepo
 */

const BlockService = require('../src/block-service.js')

// Creates a new block from string. It hashes the data and creates a CIDv1
// with RAW codec.
const blockFromString = async (data) => {
  const bytes = uint8ArrayFromString(data)
  const hash = await sha256.digest(bytes)
  return {
    cid: CID.create(1, rawCodec.code, hash),
    bytes
  }
}

describe('block-service', () => {
  /** @type {IPFSRepo} */
  const repo = createTempRepo()

  /** @type {BlockService} */
  let bs
  /** @type {Block[]} */
  let testBlocks

  before(async () => {
    await repo.init({})
    await repo.open()
    bs = new BlockService(repo)

    const data = [
      '1',
      '2',
      '3',
      'A random data block'
    ]

    testBlocks = await Promise.all(data.map(async (d) => {
      return blockFromString(d)
    }))
  })

  describe('fetch only from local Repo', () => {
    it('store and get a block', async () => {
      const b = testBlocks[3]

      await bs.put(b)
      const res = await bs.get(b.cid)
      expect(res).to.eql(b)
    })

    it('get a non stored yet block', async () => {
      const b = testBlocks[2]

      try {
        await bs.get(b.cid)
      } catch (err) {
        expect(err).to.exist()
      }
    })

    it('store many blocks', async () => {
      await drain(bs.putMany(testBlocks))

      expect(
        await Promise.all(
          testBlocks.map(b => bs.get(b.cid))
        )
      ).to.deep.equal(
        testBlocks
      )
    })

    it('get many blocks through .get', async () => {
      const blocks = await Promise.all(testBlocks.map(b => bs.get(b.cid)))
      expect(blocks).to.eql(testBlocks)
    })

    it('get many blocks through .getMany', async () => {
      const cids = testBlocks.map(b => b.cid)
      const blocks = await all(bs.getMany(cids))
      expect(blocks).to.eql(testBlocks)
    })

    it('delete a block', async () => {
      const block = await blockFromString('Will not live that much')

      await bs.put(block)
      await bs.delete(block.cid)
      const res = await bs._repo.blocks.has(asLegacyCid(block.cid))
      expect(res).to.be.eql(false)
    })

    it('does not delete a block it does not have', async () => {
      const block = await blockFromString('Will not live that much ' + Date.now())

      await bs.delete(block.cid)
        .then(
          () => expect.fail('Should have thrown'),
          (err) => expect(err).to.have.property('code', 'ERR_BLOCK_NOT_FOUND')
        )
    })

    it('deletes lots of blocks', async () => {
      const block = await blockFromString('Will not live that much')

      await bs.put(block)
      await drain(bs.deleteMany([block.cid]))
      const res = await bs._repo.blocks.has(asLegacyCid(block.cid))
      expect(res).to.be.false()
    })

    it('does not delete a blocks it does not have', async () => {
      const block = await blockFromString('Will not live that much ' + Date.now())

      await expect(drain(bs.deleteMany([block.cid]))).to.eventually.be.rejected().with.property('code', 'ERR_BLOCK_NOT_FOUND')
    })

    it('stores and gets lots of blocks', async function () {
      this.timeout(20 * 1000)

      const blocks = await Promise.all(range(200).map(async (i) => {
        return blockFromString(`hello-${i}-${Math.random()}`)
      }))

      await drain(bs.putMany(blocks))
      const res = await Promise.all(blocks.map(b => bs.get(b.cid)))
      expect(res).to.be.eql(blocks)
    })

    it('sets and unsets exchange', () => {
      bs = new BlockService(repo)
      bs.setExchange({})
      expect(bs.hasExchange()).to.be.eql(true)
      bs.unsetExchange()
      expect(bs.hasExchange()).to.be.eql(false)
      })
  })

  describe('fetch through Bitswap (has exchange)', () => {
    beforeEach(() => {
      bs = new BlockService(repo)
    })

    it('hasExchange returns true when online', () => {
      bs.setExchange({})
      expect(bs.hasExchange()).to.be.eql(true)
    })

    it('retrieves a block through bitswap', async () => {
      // returns a block with a value equal to its key
      const bitswap = {
        /**
         * @param {CID} cid
         */
        get (cid) {
          return new IpldBlock(uint8ArrayFromString('secret'), cid)
        }
      }

      bs.setExchange(bitswap)

      const block = await blockFromString('secret')
      const result = await bs.get(block.cid)

      expect(result.bytes).to.be.eql(block.bytes)
    })

    it('puts the block through bitswap', async () => {
      /** @type {Block[]} */
      const puts = []
      const bitswap = {
        /**
         * @param {Block} block
         */
        put (block) {
          puts.push(block)
        }
      }
      bs.setExchange(bitswap)

      const block = await blockFromString('secret sauce')

      await bs.put(block)

      expect(puts).to.have.length(1)
    })
  })
})
