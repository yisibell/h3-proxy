import type { ConsolaOptions, ConsolaInstance } from 'consola'

export interface CreateLoggerOptions {
  // Whether to enable logger
  enableLogger?: boolean
  // Configure the options of consola
  loggerOptions?: ConsolaOptions
}

export type Logger = ConsolaInstance

export type CreateLogger = (options: CreateLoggerOptions) => Logger | undefined
