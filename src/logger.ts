import consola from 'consola'
import type { CreateLogger } from './interfaces/logger'

export const createLogger: CreateLogger = ({ enableLogger, loggerOptions }) => {
  const finalLoggerOptions = Object.assign({}, loggerOptions)

  if (enableLogger) {
    return consola.create(finalLoggerOptions)
  }
}