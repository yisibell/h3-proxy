'use strict';

var isGlob = require('is-glob');
var micromatch = require('micromatch');
var url = require('node:url');
var consola = require('consola');

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
var Symbol$3 = root.Symbol;

var _Symbol = Symbol$3;

var Symbol$2 = _Symbol;

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
var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : undefined;

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

var Symbol$1 = _Symbol,
    getRawTag = _getRawTag,
    objectToString = _objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

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
        throw new Error('Illegal configuration');
    }
}
function parsePathRewriteRules(rewriteRecord) {
    const rules = [];
    if (isPlainObject_1(rewriteRecord)) {
        for (const [key, value] of Object.entries(rewriteRecord)) {
            rules.push({
                regex: new RegExp(key),
                value: value,
            });
            consola.info('rewrite rule created: "%s" ~> "%s"', key, value);
        }
    }
    return rules;
}
const createPathRewriter = (rewriteConfig) => {
    if (!isValidRewriteConfig(rewriteConfig)) {
        return;
    }
    let rulesCache;
    function rewritePath(path) {
        let result = path;
        for (const rule of rulesCache) {
            if (rule.regex.test(path)) {
                result = result.replace(rule.regex, rule.value);
                consola.info('rewriting path from "%s" to "%s"', path, result);
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
        rulesCache = parsePathRewriteRules(rewriteConfig);
        return rewritePath;
    }
};

class H3Error extends Error {
  constructor() {
    super(...arguments);
    this.statusCode = 500;
    this.fatal = false;
    this.unhandled = false;
    this.statusMessage = void 0;
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: this.statusCode
    };
    if (this.statusMessage) {
      obj.statusMessage = this.statusMessage;
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
H3Error.__h3_error__ = true;
function createError(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(
    input.message ?? input.statusMessage,
    // @ts-ignore
    input.cause ? { cause: input.cause } : void 0
  );
  if ("stack" in input) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = input.statusCode;
  } else if (input.status) {
    err.statusCode = input.status;
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}
function getMethod(event, defaultMethod = "GET") {
  return (event.node.req.method || defaultMethod).toUpperCase();
}
function isMethod(event, expected, allowHead) {
  const method = getMethod(event);
  if (allowHead && method === "HEAD") {
    return true;
  }
  if (typeof expected === "string") {
    if (method === expected) {
      return true;
    }
  } else if (expected.includes(method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected, allowHead)) {
    throw createError({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}

const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  if (RawBodySymbol in event.node.req) {
    const promise2 = Promise.resolve(event.node.req[RawBodySymbol]);
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if ("body" in event.node.req) {
    return Promise.resolve(event.node.req.body);
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "")) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function splitCookiesString(cookiesString) {
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  function skipWhitespace() {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  }
  function notSpecialChar() {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  }
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start, cookiesString.length));
    }
  }
  return cookiesStrings;
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host"
]);
async function proxyRequest(event, target, opts = {}) {
  const method = getMethod(event);
  let body;
  if (PayloadMethods.has(method)) {
    body = await readRawBody(event).catch(() => void 0);
  }
  const headers = getProxyRequestHeaders(event);
  if (opts.fetchOptions?.headers) {
    Object.assign(headers, opts.fetchOptions.headers);
  }
  if (opts.headers) {
    Object.assign(headers, opts.headers);
  }
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      headers,
      method,
      body,
      ...opts.fetchOptions
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  const response = await _getFetch(opts.fetch)(target, {
    headers: opts.headers,
    ...opts.fetchOptions
  });
  event.node.res.statusCode = response.status;
  event.node.res.statusMessage = response.statusText;
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      const cookies = splitCookiesString(value).map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      });
      event.node.res.setHeader("set-cookie", cookies);
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  for await (const chunk of response.body) {
    event.node.res.write(chunk);
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name)) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}

typeof setImmediate !== "undefined" ? setImmediate : (fn) => fn();

const createProxyEventHandler = (options) => {
    const { target, pathFilter, pathRewrite, proxyRequestOptions } = options;
    return (event) => {
        const { req } = event.node;
        const path = url.parse(req.url || '').pathname || '';
        if (isTargetFilterPath(path, { pathFilter, req })) {
            const pathRewriter = createPathRewriter(pathRewrite);
            const rewritedPath = pathRewriter ? pathRewriter(path, req) : path;
            const targetUrl = `${target}${rewritedPath}`;
            return proxyRequest(event, targetUrl, proxyRequestOptions);
        }
    };
};

exports.createProxyEventHandler = createProxyEventHandler;
