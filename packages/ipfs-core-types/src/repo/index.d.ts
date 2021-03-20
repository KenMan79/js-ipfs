import type { AbortOptions } from '../basic'
import type BigInteger from 'bignumber.js'
import CID from 'cids'

export interface API<OptionExtension = {}> {
  gc: (options?: GCOptions & OptionExtension) => AsyncIterable<GCResult>
  stat: (options?: AbortOptions & OptionExtension) => Promise<StatResult>
  version: (options?: AbortOptions & OptionExtension) => Promise<number>
}

export interface GCOptions extends AbortOptions {
  quiet?: boolean
}

export interface GCError {
  err: Error
}

export interface GCSuccess {
  cid: CID
}

export type GCResult  = GCSuccess | GCError

export interface StatResult {
  numObjects: BigInteger
  repoPath: string
  repoSize: BigInteger
  version: string
  storageMax: BigInteger
}
