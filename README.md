<p align="center">
  <a href="https://www.npmjs.org/package/h3-proxy">
    <img src="https://img.shields.io/npm/v/h3-proxy.svg">
  </a>
  <a href="https://npmcharts.com/compare/h3-proxy?minimal=true">
    <img src="https://img.shields.io/npm/dm/h3-proxy.svg">
  </a>
  <br>
</p>

# h3-proxy

A **proxy event handler** for [h3](https://github.com/unjs/h3), using `proxyRequest`.

- ✨ [Release Notes](./CHANGELOG.md)

# Features

- Powered by built-in [proxyRequest](https://github.com/unjs/h3/blob/main/src/utils/proxy.ts) of [h3](https://github.com/unjs/h3).
- Support http(s) proxy via some simple [configurations](https://github.com/yisibell/h3-proxy#options).
- Support logs via **consola**.
- Support **Typescript**.

# Installation

```bash
# pnpm
$ pnpm add h3-proxy

# yarn
$ yarn add h3-proxy

# npm
$ npm i h3-proxy
```

# Basic usage

```ts
import { createServer } from 'node:http'
import { createApp, eventHandler, toNodeListener } from 'h3'
import { createProxyEventHandler } from 'h3-proxy'

const app = createApp()

const port = process.env.PORT || 3000

// Define proxy event handler
const proxyEventHandler = createProxyEventHandler({
  target: `http://127.0.0.1:${port}`,
  pathRewrite: {
    '^/api': '',
  },
  pathFilter: ['/api/**'],
  // enableLogger: true
})

// Add proxy middlewares
app.use(eventHandler(proxyEventHandler))

// Define api routes
app.use(
  '/test',
  eventHandler(() => 'Hello world!')
)

createServer(toNodeListener(app)).listen(port)
```

# Multiple proxy targets usage

### Create multiple proxy **h3** event handler middleware.

```ts
import { createServer } from 'node:http'
import { createApp, eventHandler, toNodeListener } from 'h3'
import { createProxyEventHandler } from 'h3-proxy'

const app = createApp()

const port = process.env.PORT || 3000

// proxy to `http://127.0.0.1:${port}`
const proxyEventHandler1 = createProxyEventHandler({
  target: `http://127.0.0.1:${port}`, // http://127.0.0.1:3000
  pathRewrite: {
    '^/api': '',
  },
  pathFilter: ['/api/**'],
})

// proxy to other target
const proxyEventHandler2 = createProxyEventHandler({
  target: `http://127.0.0.1:${port}/other-api-module`,
  pathRewrite: {
    '^/other-api': '',
  },
  pathFilter: ['/other-api/**'],
})

// Add proxy middlewares
app.use(eventHandler(proxyEventHandler1))
app.use(eventHandler(proxyEventHandler2))

// Define api routes
app.use(
  '/test',
  eventHandler(() => 'Hello world!')
)

app.use(
  '/other-api-module/some/path',
  eventHandler(() => 'Hello other API module!')
)

createServer(toNodeListener(app)).listen(port)
```

- For `proxyEventHandler1`, The result of proxy request  is as follows:

`/api/test` -> `http://127.0.0.1:3000/test`


- For `proxyEventHandler2`, The result of proxy request  is as follows:

`/other-api/some/path` -> `http://127.0.0.1:3000/other-api-module/some/path`


### Or, using **Array** type options to define multiple proxy targets (added in v1.11.0).

```ts
const proxyEventHandler = createProxyEventHandler([
  {
    // options
  },
  {
    // other proxy target options
  }
])
```

# APIs

## createProxyEventHandler

Create a `h3` event handler that can handle **proxy requests**.

```ts
const proxyEventHandler = createProxyEventHandler({
  // options
})
```

# Options

| Key | Type | Required | Default value | Description |
| :---: | :---: | :---: | :---: | :---:  |
| `target` | `string` | `true` | `undefined` | Proxy target address, including **protocol**, **host** and **port**. url string to be parsed with the `node:url` module|
| [pathFilter](https://github.com/yisibell/h3-proxy#pathFilter) | `string, string[], glob, glob[], Function` | `false` | `undefined` |Narrow down which requests should be proxied. |
| [pathRewrite](https://github.com/yisibell/h3-proxy#pathRewrite) | `object/Function` | `false` | `undefined` | Rewrite target's url path. Object-keys will be used as RegExp to match paths. |
| [configureProxyRequest](https://github.com/yisibell/h3-proxy#configureProxyRequest) | `Function` | `false` | `undefined` | Configure options of `proxyRequest`. More details see <a href="https://github.com/unjs/h3">built-in util proxyRequest of h3</a> |
| `enableLogger` | `boolean` | `false` | `true` | Whether to enable logger which is created by **consola**. |
| `loggerOptions` | `ConsolaOptions` | `false` | `{}` | Configure the options of [consola](https://github.com/unjs/consola). |
| `changeOrigin` | `boolean` | `false` | `false` | Whether to changes the origin of the host header to the target URL |


## pathFilter

- **path matching**

  - `createProxyEventHandler({...})` - matches any path, all requests will be proxied when `pathFilter` is not configured.
  - `createProxyEventHandler({ pathFilter: '/api', ...})` - matches paths starting with `/api`

- **multiple path matching**

  - `createProxyEventHandler({ pathFilter: ['/api', '/ajax', '/someotherpath'], ...})`

- **wildcard path matching**

  For fine-grained control you can use wildcard matching. Glob pattern matching is done by _micromatch_. Visit [micromatch](https://www.npmjs.com/package/micromatch) or [glob](https://www.npmjs.com/package/glob) for more globbing examples.

  - `createProxyEventHandler({ pathFilter: '**', ...})` matches any path, all requests will be proxied.
  - `createProxyEventHandler({ pathFilter: '**/*.html', ...})` matches any path which ends with `.html`
  - `createProxyEventHandler({ pathFilter: '/*.html', ...})` matches paths directly under path-absolute
  - `createProxyEventHandler({ pathFilter: '/api/**/*.html', ...})` matches requests ending with `.html` in the path of `/api`
  - `createProxyEventHandler({ pathFilter: ['/api/**', '/ajax/**'], ...})` combine multiple patterns
  - `createProxyEventHandler({ pathFilter: ['/api/**', '!**/bad.json'], ...})` exclusion

> :warning: TIPS, In multiple path matching, you cannot use string paths and wildcard paths together.

- **custom matching**

  For full control you can provide a custom function to determine which requests should be proxied or not.

  ```js
  /**
   * @return {Boolean}
   */
  const pathFilter = function (path, req) {

    return path.match(/^\/api/) && req.method === 'GET';

    // TIPS: if you are using it in nuxt-proxy-request
    // Pls use `new RegExp()` instead.

    // return path.match(new RegExp('^\/api')) && req.method === 'GET';
  };

  const apiProxy = createProxyEventHandler({
    target: 'http://www.example.org',
    pathFilter: pathFilter,
  });
  ```

## pathRewrite

Rewrite target's url path. **Object-keys** will be used as **RegExp** to match paths.

```js
// rewrite path
pathRewrite: {'^/old/api' : '/new/api'}

// remove path
pathRewrite: {'^/remove/api' : ''}

// add base path
pathRewrite: {'^/' : '/basepath/'}

// custom rewriting
pathRewrite: function (path, req) { return path.replace('/api', '/base/api') }

// custom rewriting, returning Promise
pathRewrite: async function (path, req) {
  const should_add_something = await httpRequestToDecideSomething(path);
  if (should_add_something) path += "something";
  return path;
}
```

## configureProxyRequest

For the return value, Please refer to the source code of [proxyRequest of h3](https://github.com/unjs/h3/blob/main/src/utils/proxy.ts).

```ts
createProxyEventHandler({
  // ...
  // the param `event` is H3Event
  configureProxyRequest(event) {
    // return your custom options of proxyRequest

    // eg: specify some request headers
    // return {
    //   headers: {}
    // }

    return {}
  }
})
```

# Framework Supports
## Nuxt

- using [nuxt-proxy-request](https://github.com/yisibell/nuxt-proxy-request) module.
- using `h3-proxy` directly in **Nuxt**.

Add a [server middleware](https://nuxt.com/docs/guide/directory-structure/server#server-middleware).

```ts
// ~/server/middleware/proxy.ts

import { createProxyEventHandler } from 'h3-proxy'

export default defineEventHandler(createProxyEventHandler({
  // options...
}))
```