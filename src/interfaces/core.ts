import type { EventHandler, ProxyOptions, H3Event } from 'h3'
import type { PathFilterParams } from './pathFilter'
import type { PathRewriterParams } from './pathRewriter'
import type { ConsolaOptions } from 'consola'

export type ProxyRequestOptions = ProxyOptions

export type ProxyRequestMethod = (
  event: H3Event,
  target: string,
  opts?: ProxyRequestOptions,
) => Promise<any>

export type ConfigureProxyRequest = (event: H3Event) => ProxyRequestOptions

export interface CreateProxyEventHandlerOptions {
  target: string
  pathFilter?: PathFilterParams
  pathRewrite?: PathRewriterParams
  /** Configure options of proxyRequest which is h3's built-in util */
  configureProxyRequest?: ConfigureProxyRequest
  /** customize proxyRequest method */
  proxyRequestMethod?: ProxyRequestMethod
  /** Whether to enable logger */
  enableLogger?: boolean
  /** Configure the options of consola */
  loggerOptions?: ConsolaOptions
  /** true/false, Default: false - changes the origin of the host header to the target URL */
  changeOrigin?: boolean
}

export type CreateProxyEventHandler = (
  options: CreateProxyEventHandlerOptions | CreateProxyEventHandlerOptions[],
) => EventHandler
