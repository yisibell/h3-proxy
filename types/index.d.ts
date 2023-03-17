import type { CreateProxyEventHandler, CreateProxyEventHandlerOptions, ConfigureProxyRequest } from '../src/interfaces/core'
import type { PathFilterParams } from '../src/interfaces/pathFilter'
import type { PathRewriterParams } from '../src/interfaces/pathRewriter'

declare const createProxyEventHandler: CreateProxyEventHandler

export { 
  createProxyEventHandler, 
  CreateProxyEventHandlerOptions, 
  ConfigureProxyRequest, 
  PathFilterParams,
  PathRewriterParams
}
