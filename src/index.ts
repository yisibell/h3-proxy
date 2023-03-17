import { isTargetFilterPath } from './pathFilter'
import url from 'node:url'
import type { CreateProxyEventHandler } from './interfaces/core'
import { createPathRewriter } from './pathRewriter'
import { proxyRequest } from 'h3'
import { ERRORS } from './errors'
import { createLogger } from './logger'

const createProxyEventHandler: CreateProxyEventHandler = (options) => {
  const { target, pathFilter, pathRewrite, configureProxyRequest, enableLogger = true, loggerOptions } = options

  if (!target) {
    throw new Error(ERRORS.ERR_CONFIG_FACTORY_TARGET_MISSING)
  }

  const logger = createLogger({
    enableLogger,
    loggerOptions
  })

  return async (event) => {
    const { req } = event.node

    const path = url.parse(req.url || '').pathname || ''

    const proxyRequestOptions = typeof configureProxyRequest === 'function' ? configureProxyRequest(event) : undefined

    if (isTargetFilterPath(path, { pathFilter, req })) {
      const pathRewriter = createPathRewriter(pathRewrite, logger)
      
      let rewritedPath = path

      if (pathRewriter) {
        rewritedPath = await pathRewriter(path, req)
      }
      
      const targetUrl = `${target}${rewritedPath}`

      return proxyRequest(event, targetUrl, proxyRequestOptions)
    }
  }
}

export { createProxyEventHandler }
