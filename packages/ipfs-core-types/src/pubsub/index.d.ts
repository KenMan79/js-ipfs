import type { AbortOptions } from '../basic'

export interface API<OptionExtension = {}> {
  subscribe: (topic: string, handler: MessageHandlerFn, options?: AbortOptions & OptionExtension) => Promise<void>
  unsubscribe: (topic: string, handler: MessageHandlerFn, options?: AbortOptions & OptionExtension) => Promise<void>
  publish: (topic: string, data: string | Uint8Array, options?: AbortOptions & OptionExtension) => Promise<void>
  ls: (options?: AbortOptions & OptionExtension) => Promise<string[]>
  peers: (topic: string, options?: AbortOptions & OptionExtension) => Promise<string[]>
}

export interface Message {
  from: string
  seqno: Uint8Array
  data: Uint8Array
  topicIDs: string[]
}

export type MessageHandlerFn = (message: Message) => void
