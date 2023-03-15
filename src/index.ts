import { isTargetFilterPath } from './pathFilter'
import url from 'node:url'
import type { CreateProxyEventHandler } from './interfaces/core'
import { createPathRewriter } from './pathRewriter'
import { proxyRequest } from 'h3'

const createProxyEventHandler: CreateProxyEventHandler = (options) => {
  const { target, pathFilter, pathRewrite, proxyRequestOptions } = options

  return (event) => {
    const { req } = event.node

    const path = url.parse(req.url || '').pathname || ''

    if (isTargetFilterPath(path, { pathFilter, req })) {
      const pathRewriter = createPathRewriter(pathRewrite)

      const rewritedPath = pathRewriter ? pathRewriter(path, req) : path

      const targetUrl = `${target}${rewritedPath}`

      return proxyRequest(event, targetUrl, proxyRequestOptions)
    }
  }
}

export { createProxyEventHandler }
