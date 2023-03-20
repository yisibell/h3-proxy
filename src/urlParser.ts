
import { URL } from 'node:url'

const parseUrlToObject = (url: string) => {
  return new URL(url)
}

export {
  parseUrlToObject
}