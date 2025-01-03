import { isTargetFilterPath } from './pathFilter'
import type {
  CreateProxyEventHandler,
  CreateProxyEventHandlerOptions,
} from './interfaces/core'
import { createPathRewriter } from './pathRewriter'
import { proxyRequest } from 'h3'
import type { NodeIncomingMessage } from 'h3'
import { ERRORS } from './errors'
import { createLogger } from './logger'
import { createProxyRequestOptions } from './proxyRequestStrategy'
import { getUrlPath } from './urlParser'

const defaultOption = (): CreateProxyEventHandlerOptions => ({
  target: '',
  enableLogger: true,
})

const getTargetOptions = (
  req: NodeIncomingMessage,
  finalMultiOptions: CreateProxyEventHandlerOptions[],
) => {
  let path = ''

  const finalOptions = finalMultiOptions.find((v) => {
    path = getUrlPath(req.url, v.target)
    return isTargetFilterPath(path, { pathFilter: v.pathFilter, req })
  })

  return {
    path,
    finalOptions,
  }
}

const createProxyEventHandler: CreateProxyEventHandler = (options) => {
  const multiOptions = Array.isArray(options) ? options : [options]

  const finalMultiOptions = multiOptions.map((v) =>
    Object.assign(defaultOption(), v),
  )

  return async (event) => {
    const { req } = event.node

    const { finalOptions, path } = getTargetOptions(req, finalMultiOptions)

    if (finalOptions) {
      const {
        target,
        pathRewrite,
        enableLogger,
        loggerOptions,
        proxyRequestMethod,
      } = finalOptions

      if (!target) {
        throw new Error(ERRORS.ERR_CONFIG_FACTORY_TARGET_MISSING)
      }

      const logger = createLogger({
        enableLogger,
        loggerOptions,
      })

      const pathRewriter = createPathRewriter(pathRewrite, logger)

      let rewritedPath = path

      if (pathRewriter) {
        rewritedPath = await pathRewriter(path, req)
      }

      const targetUrl = `${target}${rewritedPath}`

      logger?.success('proxy to target url:', targetUrl)

      // generate proxy request options via default strategy
      const proxyRequestOptions = createProxyRequestOptions(event, finalOptions)

      // customize proxy request method
      if (proxyRequestMethod) {
        return proxyRequestMethod(event, targetUrl, proxyRequestOptions)
      }

      return proxyRequest(event, targetUrl, proxyRequestOptions)
    }
  }
}

export { createProxyEventHandler }
