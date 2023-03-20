import type { ConsolaOptions, Consola } from 'consola'

export interface CreateLoggerOptions {
  // Whether to enable logger
  enableLogger?: boolean
  // Configure the options of consola
  loggerOptions?: ConsolaOptions
}

export type Logger = Consola

export type CreateLogger = (options: CreateLoggerOptions) => Logger | undefined