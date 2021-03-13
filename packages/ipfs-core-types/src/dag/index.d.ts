import { AbortOptions, PreloadOptions, IPFSPath } from '../basic'
import CID from 'cids'
import { CodecName } from 'multicodec'
import { HashName } from 'multihashes'

export interface API {
  get: (cid: CID, options?: GetOptions) => Promise<GetResult>
  put: (node: any, options?: PutOptions) => Promise<CID>
  tree: (cid: CID, options?: TreeOptions) => Promise<string[]>
  resolve: (ipfsPath: IPFSPath, options?: ResolveOptions) => Promise<ResolveResult>
}

export interface GetOptions extends AbortOptions, PreloadOptions {
  /**
   * An optional path within the DAG to resolve
   */
  path?: string

  /**
   * If set to true, it will avoid resolving through different objects
   */
  localResolve?: boolean
}

export interface GetResult {
  /**
   * The value or node that was fetched during the get operation
   */
  value: any

  /**
   * The remainder of the Path that the node was unable to resolve or what was left in a localResolve scenario
   */
  remainderPath?: string
}

export interface PutOptions extends AbortOptions, PreloadOptions {
  /**
   *  CID to store the value with
   */
  cid?: CID

  /**
   * The codec to use to create the CID (ignored if `cid` is passed)
   */
  format?: CodecName

  /**
   * Multihash hashing algorithm to use (ignored if `cid` is passed)
   */
  hashAlg?: HashName

  /**
   * The version to use to create the CID (ignored if `cid` is passed)
   */
  version?: CIDVersion

  /**
   * Pin this block when adding. (Defaults to `false`)
   */
  pin?: boolean
}

export interface RmOptions extends AbortOptions {
  /**
   * Ignores non-existent blocks
   */
  force?: boolean
}

export interface TreeOptions extends AbortOptions, PreloadOptions {
  /**
   * An optional path within the DAG to resolve
   */
  path?: string

  /**
   * If set to true, it will follow the links and continuously run tree on them, returning all the paths in the graph
   */
  recursive?: boolean
}

export interface ResolveOptions extends AbortOptions, PreloadOptions {
  /**
   * If ipfsPath is a CID, you may pass a path here
   */
  path?: string
}

export interface ResolveResult {
  /**
   * The last CID encountered during the traversal and the path to the end of the IPFS path inside the node referenced by the CID
   */
  cid: CID

  /**
   * The remainder of the Path that the node was unable to resolve
   */
  remainderPath?: string
}