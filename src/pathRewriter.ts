import type {
  CreatePathRewriter,
  PathRewriterParams,
  RewriteRule,
  RewriteRecord,
} from './interfaces/pathRewriter'
import isPlainObj from 'lodash/isPlainObject'
import consola from 'consola'

function isValidRewriteConfig(rewriteConfig?: PathRewriterParams) {
  if (typeof rewriteConfig === 'function') {
    return true
  } else if (isPlainObj(rewriteConfig)) {
    return Object.keys(rewriteConfig as object).length !== 0
  } else if (rewriteConfig === undefined || rewriteConfig === null) {
    return false
  } else {
    throw new Error('Illegal configuration')
  }
}

function parsePathRewriteRules(rewriteRecord: RewriteRecord) {
  const rules: RewriteRule[] = []

  if (isPlainObj(rewriteRecord)) {
    for (const [key, value] of Object.entries(rewriteRecord)) {
      rules.push({
        regex: new RegExp(key),
        value: value,
      })
      consola.info('rewrite rule created: "%s" ~> "%s"', key, value)
    }
  }

  return rules
}

/**
 * Create a path rewriter function
 */
const createPathRewriter: CreatePathRewriter = (rewriteConfig) => {
  if (!isValidRewriteConfig(rewriteConfig)) {
    return
  }

  let rulesCache: RewriteRule[]

  function rewritePath(path: string) {
    let result = path

    for (const rule of rulesCache) {
      if (rule.regex.test(path)) {
        result = result.replace(rule.regex, rule.value)
        consola.info('rewriting path from "%s" to "%s"', path, result)
        break
      }
    }

    return result
  }

  if (typeof rewriteConfig === 'function') {
    const customRewriteFn = rewriteConfig
    return customRewriteFn
  } else {
    rulesCache = parsePathRewriteRules(rewriteConfig as RewriteRecord)
    return rewritePath
  }
}

export { createPathRewriter }
