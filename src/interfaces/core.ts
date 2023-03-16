import type { EventHandler, ProxyOptions, H3Event } from 'h3'
import type { PathFilterParams } from './pathFilter'
import type { PathRewriterParams } from './pathRewriter'

export type ConfigureProxyRequest = (event: H3Event) => ProxyOptions

export interface CreateProxyEventHandlerOptions {
  target: string
  pathFilter?: PathFilterParams
  pathRewrite?: PathRewriterParams
  configureProxyRequest?: ConfigureProxyRequest
}

export type CreateProxyEventHandler = (
  options: CreateProxyEventHandlerOptions
) => EventHandler
