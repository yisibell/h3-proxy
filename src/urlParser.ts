import { URL } from 'node:url'

const parseUrlToObject = (url: string) => {
  return new URL(url)
}

const getUrlPath = (url?: string, base?: string) => {
  if (!url) return ''

  const { pathname, search } = new URL(url, base)

  return `${pathname}${search}`
}

export { parseUrlToObject, getUrlPath }
