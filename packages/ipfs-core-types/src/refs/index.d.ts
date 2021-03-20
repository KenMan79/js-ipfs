import type { AbortOptions, PreloadOptions, IPFSPath } from '../basic'
import type CID from 'cids'

export type API<OptionExtension = {}> = {
  refs: Refs<OptionExtension>
  local: Local<OptionExtension>
}

export type Refs<OptionExtension = {}> = (ipfsPath: IPFSPath | IPFSPath[], options?: RefsOptions & OptionExtension) => AsyncIterable<RefsResult>

export interface RefsOptions extends AbortOptions, PreloadOptions {
  recursive?: boolean
  unique?: boolean
  format?: string
  edges?: boolean
  maxDepth?: number
}

export type Local<OptionExtension = {}> = (options?: AbortOptions & OptionExtension) => AsyncIterable<RefsResult>

export interface RefsResult {
  ref: string
  error?: Error
}
