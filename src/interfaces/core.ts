import type { EventHandler, ProxyOptions, H3Event } from 'h3'
import type { PathFilterParams } from './pathFilter'
import type { PathRewriterParams } from './pathRewriter'
import type { ConsolaOptions } from 'consola'

export type ConfigureProxyRequest = (event: H3Event) => ProxyOptions

export interface CreateProxyEventHandlerOptions {
  target: string
  pathFilter?: PathFilterParams
  pathRewrite?: PathRewriterParams
  // Configure options of proxyRequest which is h3's built-in util
  configureProxyRequest?: ConfigureProxyRequest
  // Whether to enable logger
  enableLogger?: boolean
  // Configure the options of consola
  loggerOptions?: ConsolaOptions
}

export type CreateProxyEventHandler = (
  options: CreateProxyEventHandlerOptions
) => EventHandler
