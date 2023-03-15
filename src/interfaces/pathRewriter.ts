import type { IncomingMessage } from 'http'

export type CustomPathRewriter = (
  pathname: string,
  req: IncomingMessage
) => string

export type RewriteRecord = Record<string, string>

export type PathRewriterParams = RewriteRecord | CustomPathRewriter

export type CreatePathRewriter = (
  pathRewrite?: PathRewriterParams
) => CustomPathRewriter | undefined

export type RewriteRule = { regex: RegExp; value: string }
