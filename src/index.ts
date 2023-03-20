import { isTargetFilterPath } from './pathFilter'
import type { CreateProxyEventHandler } from './interfaces/core'
import { createPathRewriter } from './pathRewriter'
import { proxyRequest } from 'h3'
import { ERRORS } from './errors'
import { createLogger } from './logger'
import { createProxyRequestOptions } from './proxyRequestStrategy'
import { getUrlPath } from './urlParser'

const createProxyEventHandler: CreateProxyEventHandler = (options) => {
  const finalOptions = Object.assign({ enableLogger: true }, options)
  const { target, pathFilter, pathRewrite, enableLogger, loggerOptions } =
    finalOptions

  if (!target) {
    throw new Error(ERRORS.ERR_CONFIG_FACTORY_TARGET_MISSING)
  }

  const logger = createLogger({
    enableLogger,
    loggerOptions,
  })

  return async (event) => {
    const { req } = event.node

    const path = getUrlPath(req.url, target)

    // generate proxy request options via default strategy
    const proxyRequestOptions = createProxyRequestOptions(event, finalOptions)

    if (isTargetFilterPath(path, { pathFilter, req })) {
      const pathRewriter = createPathRewriter(pathRewrite, logger)

      let rewritedPath = path

      if (pathRewriter) {
        rewritedPath = await pathRewriter(path, req)
      }

      const targetUrl = `${target}${rewritedPath}`

      logger && logger.success('proxy to target url:', targetUrl)

      return proxyRequest(event, targetUrl, proxyRequestOptions)
    }
  }
}

export { createProxyEventHandler }
