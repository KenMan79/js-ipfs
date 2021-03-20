import type { AbortOptions } from '../basic'
import type PeerId from 'peer-id'
import type Multiaddr from 'multiaddr'
import type CID from 'cids'

export interface API<OptionExtension = {}> {
  findPeer: (peerId: PeerId, options?: AbortOptions & OptionExtension) => Promise<PeerResult>
  findProvs: (cid: CID, options?: DHTFindProvsOptions & OptionExtension) => AsyncIterable<PeerResult>
  get: (key: Uint8Array, options?: AbortOptions & OptionExtension) => Promise<Uint8Array>
  provide: (cid: CID | CID[], options?: DHTProvideOptions & OptionExtension) => AsyncIterable<DHTQueryMessage>
  put: (key: Uint8Array, value: Uint8Array, options?: AbortOptions & OptionExtension) => AsyncIterable<DHTQueryMessage>
  query: (peerId: PeerId | CID, options?: AbortOptions & OptionExtension) => AsyncIterable<PeerResult>
}

export interface PeerResult {
  id: string
  addrs: Multiaddr[]
}

export interface DHTFindProvsOptions extends AbortOptions {
  numProviders?: number
}

export interface DHTProvideOptions extends AbortOptions {
  recursive?: boolean
}

export enum QueryEventType {
  SendingQuery = 1,
  PeerResponse,
  FinalPeer,
  QueryError,
  Provider,
  Value,
  AddingPeer,
  DialingPeer
}

export interface DHTQueryMessage {
  extra: string
  id: string
  responses: PeerResult[]
  type: QueryEventType
}
