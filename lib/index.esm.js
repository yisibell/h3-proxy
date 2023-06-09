import isGlob from 'is-glob';
import micromatch from 'micromatch';
import { proxyRequest } from 'h3';
import consola from 'consola';
import { URL } from 'node:url';

var ERRORS;
(function (ERRORS) {
    ERRORS["ERR_CONFIG_FACTORY_TARGET_MISSING"] = "[h3-proxy] Missing \"target\" option. Example: {target: \"http://www.example.org\"}";
    ERRORS["ERR_CONTEXT_MATCHER_INVALID_ARRAY"] = "[h3-proxy] Invalid pathFilter. Expecting something like: [\"/api\", \"/ajax\"] or [\"/api/**\", \"!**.html\"]";
    ERRORS["ERR_PATH_REWRITER_CONFIG"] = "[h3-proxy] Invalid pathRewrite config. Expecting object with pathRewrite config or a rewrite function";
})(ERRORS || (ERRORS = {}));

const isStringPath = (pathFilter) => {
    return typeof pathFilter === 'string' && !isGlob(pathFilter);
};
const isGlobPath = (pattern) => {
    return typeof pattern === 'string' && isGlob(pattern);
};
const isMultiPath = (pathFilter) => {
    return Array.isArray(pathFilter);
};
const matchSingleStringPath = (pathname, pathFilter) => {
    if (!pathFilter)
        return false;
    return pathname.indexOf(pathFilter) >= 0;
};
const matchMultiPath = (pathname, pathFilterList) => {
    return pathFilterList.some((pattern) => matchSingleStringPath(pathname, pattern));
};
const matchSingleGlobPath = (pathname, pattern) => {
    if (!pattern)
        return false;
    const matches = micromatch([pathname], pattern);
    return matches && matches.length > 0;
};
const matchMultiGlobPath = (pathname, patterns) => {
    return matchSingleGlobPath(pathname, patterns);
};
const isTargetFilterPath = (pathname = '', { pathFilter, req }) => {
    if (typeof pathFilter === 'function') {
        return pathFilter(pathname, req);
    }
    if (isGlobPath(pathFilter)) {
        return matchSingleGlobPath(pathname, pathFilter);
    }
    if (isStringPath(pathFilter)) {
        return matchSingleStringPath(pathname, pathFilter);
    }
    if (isMultiPath(pathFilter)) {
        if (pathFilter.every(isStringPath)) {
            return matchMultiPath(pathname, pathFilter);
        }
        if (pathFilter.every(isGlobPath)) {
            return matchMultiGlobPath(pathname, pathFilter);
        }
        throw new Error(ERRORS.ERR_CONTEXT_MATCHER_INVALID_ARRAY);
    }
    return true;
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/** Detect free variable `global` from Node.js. */

var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal$1;

var freeGlobal = _freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$1 = freeGlobal || freeSelf || Function('return this')();

var _root = root$1;

var root = _root;

/** Built-in value references. */
var Symbol$2 = root.Symbol;

var _Symbol = Symbol$2;

var Symbol$1 = _Symbol;

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$2.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag$1(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

var _getRawTag = getRawTag$1;

/** Used for built-in method references. */

var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString$1(value) {
  return nativeObjectToString.call(value);
}

var _objectToString = objectToString$1;

var Symbol = _Symbol,
    getRawTag = _getRawTag,
    objectToString = _objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag$1(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

var _baseGetTag = baseGetTag$1;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */

function overArg$1(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg$1;

var overArg = _overArg;

/** Built-in value references. */
var getPrototype$1 = overArg(Object.getPrototypeOf, Object);

var _getPrototype = getPrototype$1;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */

function isObjectLike$1(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike$1;

var baseGetTag = _baseGetTag,
    getPrototype = _getPrototype,
    isObjectLike = isObjectLike_1;

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

var isPlainObject_1 = isPlainObject;

function isValidRewriteConfig(rewriteConfig) {
    if (typeof rewriteConfig === 'function') {
        return true;
    }
    else if (isPlainObject_1(rewriteConfig)) {
        return Object.keys(rewriteConfig).length !== 0;
    }
    else if (rewriteConfig === undefined || rewriteConfig === null) {
        return false;
    }
    else {
        throw new Error(ERRORS.ERR_PATH_REWRITER_CONFIG);
    }
}
function parsePathRewriteRules(rewriteRecord, logger) {
    const rules = [];
    if (isPlainObject_1(rewriteRecord)) {
        for (const [key, value] of Object.entries(rewriteRecord)) {
            rules.push({
                regex: new RegExp(key),
                value: value,
            });
            logger && logger.info('rewrite rule created: "%s" ~> "%s"', key, value);
        }
    }
    return rules;
}
const createPathRewriter = (rewriteConfig, logger) => {
    if (!isValidRewriteConfig(rewriteConfig)) {
        return;
    }
    let rulesCache;
    function rewritePath(path) {
        let result = path;
        for (const rule of rulesCache) {
            if (rule.regex.test(path)) {
                result = result.replace(rule.regex, rule.value);
                logger && logger.info('rewriting path from "%s" to "%s"', path, result);
                break;
            }
        }
        return result;
    }
    if (typeof rewriteConfig === 'function') {
        const customRewriteFn = rewriteConfig;
        return customRewriteFn;
    }
    else {
        rulesCache = parsePathRewriteRules(rewriteConfig, logger);
        return rewritePath;
    }
};

const createLogger = ({ enableLogger, loggerOptions }) => {
    const finalLoggerOptions = Object.assign({}, loggerOptions);
    if (enableLogger) {
        return consola.create(finalLoggerOptions);
    }
};

const parseUrlToObject = (url) => {
    return new URL(url);
};
const getUrlPath = (url, base) => {
    if (!url)
        return '';
    const { pathname, search } = new URL(url, base);
    return `${pathname}${search}`;
};

const generateOutgoingHost = (target) => {
    const { hostname, port } = parseUrlToObject(target);
    if (port) {
        return `${hostname}:${port}`;
    }
    return `${hostname}`;
};
const createProxyRequestOptions = (event, options) => {
    const { configureProxyRequest, changeOrigin, target } = options;
    const defaultOptions = {
        headers: {},
    };
    if (changeOrigin) {
        defaultOptions.headers.host = generateOutgoingHost(target);
    }
    const incomingOptions = typeof configureProxyRequest === 'function'
        ? configureProxyRequest(event)
        : {};
    const finalOptions = Object.assign(defaultOptions, incomingOptions);
    finalOptions.headers = Object.assign(defaultOptions.headers, incomingOptions.headers);
    return finalOptions;
};

const createProxyEventHandler = (options) => {
    const finalOptions = Object.assign({ enableLogger: true }, options);
    const { target, pathFilter, pathRewrite, enableLogger, loggerOptions } = finalOptions;
    if (!target) {
        throw new Error(ERRORS.ERR_CONFIG_FACTORY_TARGET_MISSING);
    }
    const logger = createLogger({
        enableLogger,
        loggerOptions,
    });
    return async (event) => {
        const { req } = event.node;
        const path = getUrlPath(req.url, target);
        const proxyRequestOptions = createProxyRequestOptions(event, finalOptions);
        if (isTargetFilterPath(path, { pathFilter, req })) {
            const pathRewriter = createPathRewriter(pathRewrite, logger);
            let rewritedPath = path;
            if (pathRewriter) {
                rewritedPath = await pathRewriter(path, req);
            }
            const targetUrl = `${target}${rewritedPath}`;
            logger && logger.success('proxy to target url:', targetUrl);
            return proxyRequest(event, targetUrl, proxyRequestOptions);
        }
    };
};

export { createProxyEventHandler };
