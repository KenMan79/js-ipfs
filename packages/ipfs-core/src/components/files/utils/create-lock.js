'use strict'

// @ts-ignore - no types
const mortice = require('mortice')

/**
 * @typedef {object} Lock
 * @property {import('ipfs-core-types/src/basic').HigherOrderFn} readLock
 * @property {import('ipfs-core-types/src/basic').HigherOrderFn} writeLock
 */

/** @type {Lock} */
let lock

/**
 * @param {boolean} [repoOwner]
 */
module.exports = (repoOwner = false) => {
  if (lock) {
    return lock
  }

  const mutex = mortice({
    // ordinarily the main thread would store the read/write lock but
    // if we are the thread that owns the repo, we can store the lock
    // on this process even if we are a worker thread
    singleProcess: repoOwner
  })

  lock = {
    readLock: (func) => {
      return async (...args) => {
        const releaseLock = await mutex.readLock()

        try {
          return await func.apply(null, args)
        } finally {
          releaseLock()
        }
      }
    },

    writeLock: (func) => {
      return async (...args) => {
        const releaseLock = await mutex.writeLock()

        try {
          return await func.apply(null, args)
        } finally {
          releaseLock()
        }
      }
    }
  }

  return lock
}
