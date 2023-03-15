import { isTargetFilterPath } from '~/pathFilter'
import url from 'node:url'
import type { CreateProxyEventHandler } from '~/interfaces/core'
import { createPathRewriter } from './pathRewriter'

const createProxyEventHandler: CreateProxyEventHandler = (options) => {
  const { target, pathFilter, pathRewrite } = options

  return (event) => {
    const { req } = event.node

    const path = url.parse(req.url || '').pathname || ''

    if (isTargetFilterPath(path, { pathFilter, req })) {
      const pathRewriter = createPathRewriter(pathRewrite)

      const rewritedPath = pathRewriter ? pathRewriter(path, req) : path

      console.log(target, path, rewritedPath)
    }
  }
}

export { createProxyEventHandler }
