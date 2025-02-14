'use strict'

const normaliseContent = require('./normalise-content')
const normaliseInput = require('./normalise-input')

/**
 * @typedef {import('ipfs-core-types/src/utils').ImportCandidateStream} ImportCandidateStream
 * @typedef {import('ipfs-unixfs-importer').ImportCandidate} ImportCandidate
 */

/*
 * Transforms any of the `ipfs.add` input types into
 *
 * ```
 * AsyncIterable<{ path, mode, mtime, content: AsyncIterable<Uint8Array> }>
 * ```
 *
 * See https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/FILES.md#ipfsadddata-options
 *
 * @param {ImportCandidateStream} input
 * @returns {AsyncGenerator<ImportCandidate, void, undefined>}
 */
// @ts-ignore TODO vmx 2021-03-30 enable again
module.exports = (input) => normaliseInput(input, normaliseContent)
