import type { NodeIncomingMessage } from 'h3'

export type CustomPathFilter = (
  pathname: string,
  req: NodeIncomingMessage,
) => boolean

export type PathFilterParams = string | string[] | CustomPathFilter

export type IsTargetFilterPath = (
  pathname: string | undefined,
  opts: {
    pathFilter?: PathFilterParams
    req: NodeIncomingMessage
  },
) => boolean
