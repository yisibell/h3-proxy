import type { EventHandler } from 'h3'
import type { PathFilterParams } from './pathFilter'
import type { PathRewriterParams } from './pathRewriter'

export interface CreateProxyEventHandlerOptions {
  target: string
  pathFilter?: PathFilterParams
  pathRewrite?: PathRewriterParams
}

export type CreateProxyEventHandler = (
  options: CreateProxyEventHandlerOptions
) => EventHandler
