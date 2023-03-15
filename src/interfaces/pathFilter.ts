import type { IncomingMessage } from 'http'

export type CustomPathFilter = (
  pathname: string,
  req: IncomingMessage
) => boolean

export type PathFilterParams = string | string[] | CustomPathFilter

export type IsTargetFilterPath = (
  pathname: string | undefined,
  opts: {
    pathFilter?: PathFilterParams
    req: IncomingMessage
  }
) => boolean
