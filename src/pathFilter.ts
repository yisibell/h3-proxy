import isGlob from 'is-glob'
import micromatch from 'micromatch'
import type { IsTargetFilterPath } from './interfaces/pathFilter'
import { ERRORS } from './errors'

const isStringPath = (pathFilter?: string | string[]): pathFilter is string => {
  return typeof pathFilter === 'string' && !isGlob(pathFilter)
}

const isGlobPath = (pattern?: string | string[]): pattern is string => {
  return typeof pattern === 'string' && isGlob(pattern)
}

const isMultiPath = (
  pathFilter?: string | string[]
): pathFilter is string[] => {
  return Array.isArray(pathFilter)
}

const matchSingleStringPath = (
  pathname: string,
  pathFilter?: string
): boolean => {
  if (!pathFilter) return false
  return pathname.indexOf(pathFilter) >= 0
}

const matchMultiPath = (pathname: string, pathFilterList: string[]) => {
  return pathFilterList.some((pattern) =>
    matchSingleStringPath(pathname, pattern)
  )
}

const matchSingleGlobPath = (
  pathname: string,
  pattern?: string | string[]
): boolean => {
  if (!pattern) return false
  const matches = micromatch([pathname], pattern)
  return matches && matches.length > 0
}

const matchMultiGlobPath = (pathname: string, patterns?: string | string[]) => {
  return matchSingleGlobPath(pathname, patterns)
}

/**
 * checkout weather the path is target filter path
 */
const isTargetFilterPath: IsTargetFilterPath = (
  pathname = '',
  { pathFilter, req }
) => {
  // custom path filter
  if (typeof pathFilter === 'function') {
    return pathFilter(pathname, req)
  }

  // single glob
  if (isGlobPath(pathFilter)) {
    return matchSingleGlobPath(pathname, pathFilter)
  }

  // single string
  if (isStringPath(pathFilter)) {
    return matchSingleStringPath(pathname, pathFilter)
  }

  // multi path
  if (isMultiPath(pathFilter)) {
    if (pathFilter.every(isStringPath)) {
      return matchMultiPath(pathname, pathFilter)
    }

    if ((pathFilter as string[]).every(isGlobPath)) {
      return matchMultiGlobPath(pathname, pathFilter)
    }

    throw new Error(ERRORS.ERR_CONTEXT_MATCHER_INVALID_ARRAY);
  }

  return true
}

export { isTargetFilterPath }
