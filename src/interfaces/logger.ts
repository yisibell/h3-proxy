import type { ConsolaOptions, Consola } from 'consola'

export interface CreateLoggerOptions {
  // Weather to enable logger
  enableLogger?: boolean
  // Configure the options of consola
  loggerOptions?: ConsolaOptions
}

export type Logger = Consola

export type CreateLogger = (options: CreateLoggerOptions) => Logger | undefined