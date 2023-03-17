import { H3Event, ProxyOptions, EventHandler } from 'h3';
import { IncomingMessage } from 'http';
import { ConsolaOptions } from 'consola';

type CustomPathFilter = (
  pathname: string,
  req: IncomingMessage
) => boolean

type PathFilterParams = string | string[] | CustomPathFilter

type CustomPathRewriter = (
  pathname: string,
  req: IncomingMessage
) => string | Promise<string>

type RewriteRecord = Record<string, string>

type PathRewriterParams = RewriteRecord | CustomPathRewriter

type ConfigureProxyRequest = (event: H3Event) => ProxyOptions

interface CreateProxyEventHandlerOptions {
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

type CreateProxyEventHandler = (
  options: CreateProxyEventHandlerOptions
) => EventHandler

declare const createProxyEventHandler: CreateProxyEventHandler

export { ConfigureProxyRequest, CreateProxyEventHandlerOptions, PathFilterParams, PathRewriterParams, createProxyEventHandler };
