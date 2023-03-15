import type { EventHandler } from 'h3'
import type { PathFilterParams } from './pathFilter'

export interface CreateProxyEventHandlerOptions {
  target: string
  pathFilter?: PathFilterParams
}

export type CreateProxyEventHandler = (
  options: CreateProxyEventHandlerOptions
) => EventHandler
