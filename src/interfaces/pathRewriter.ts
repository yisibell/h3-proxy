import type { NodeIncomingMessage } from 'h3'
import type { Logger } from './logger'

export type CustomPathRewriter = (
  pathname: string,
  req: NodeIncomingMessage,
) => string | Promise<string>

export type RewriteRecord = Record<string, string>

export type PathRewriterParams = RewriteRecord | CustomPathRewriter

export type CreatePathRewriter = (
  pathRewrite?: PathRewriterParams,
  logger?: Logger,
) => CustomPathRewriter | undefined

export type RewriteRule = { regex: RegExp; value: string }
