import { isTargetFilterPath } from '~/pathFilter'
import url from 'node:url'
import type { CreateProxyEventHandler } from '~/interfaces/core'

const createProxyEventHandler: CreateProxyEventHandler = (options) => {
  const { pathFilter } = options

  return (event) => {
    const { req } = event.node

    const path = url.parse(req.url || '').pathname || ''

    if (isTargetFilterPath(path, { pathFilter, req })) {
      console.log(path)
    }
  }
}

export { createProxyEventHandler }
