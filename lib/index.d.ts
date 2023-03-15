import { EventHandler } from 'h3';
import { IncomingMessage } from 'http';

type CustomPathFilter = (
  pathname: string,
  req: IncomingMessage
) => boolean

type PathFilterParams = string | string[] | CustomPathFilter

type CustomPathRewriter = (
  pathname: string,
  req: IncomingMessage
) => string

type RewriteRecord = Record<string, string>

type PathRewriterParams = RewriteRecord | CustomPathRewriter

interface CreateProxyEventHandlerOptions {
  target: string
  pathFilter?: PathFilterParams
  pathRewrite?: PathRewriterParams
}

type CreateProxyEventHandler = (
  options: CreateProxyEventHandlerOptions
) => EventHandler

declare const createProxyEventHandler: CreateProxyEventHandler

export { createProxyEventHandler };
