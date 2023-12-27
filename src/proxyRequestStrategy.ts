import type {
  CreateProxyEventHandlerOptions,
  ProxyRequestOptions,
} from './interfaces/core'
import type { H3Event } from 'h3'
import { parseUrlToObject } from './urlParser'

const generateOutgoingHost = (target: string) => {
  const { hostname, port } = parseUrlToObject(target)

  if (port) {
    return `${hostname}:${port}`
  }

  return `${hostname}`
}

const createProxyRequestOptions = (
  event: H3Event,
  options: CreateProxyEventHandlerOptions,
): ProxyRequestOptions | undefined => {
  const { configureProxyRequest, changeOrigin, target } = options

  const defaultOptions: ProxyRequestOptions = {
    headers: {},
  }

  if (changeOrigin) {
    defaultOptions.headers.host = generateOutgoingHost(target)
  }

  const incomingOptions =
    typeof configureProxyRequest === 'function'
      ? configureProxyRequest(event)
      : {}

  const finalOptions: ProxyRequestOptions = Object.assign(
    defaultOptions,
    incomingOptions,
  )

  finalOptions.headers = Object.assign(
    defaultOptions.headers,
    incomingOptions.headers,
  )

  return finalOptions
}

export { createProxyRequestOptions }
