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

A **proxy event handler** for `h3`, using `proxyRequest`.

# Features

- Powered by built-in `proxyRequest` of `h3`.
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

# Usage

```ts
import { createServer } from 'node:http'
import { createApp, eventHandler, toNodeListener } from 'h3'
import { createProxyEventHandler } from 'h3-proxy'

const app = createApp()

const port = process.env.PORT || 3000

const proxyEventHandler = createProxyEventHandler({
  target: `http://127.0.0.1:${port}`,
  pathRewrite: {
    '^/api': '',
  },
  pathFilter: ['/api/**'],
  // enableLogger: true
})

app.use(
  '/test',
  eventHandler(() => 'Hello world!')
)

app.use(eventHandler(proxyEventHandler))

createServer(toNodeListener(app)).listen(port)
```

# APIs

## createProxyEventHandler

Create a `h3` event handler that can handle **proxy requests**.

### Options

| Key | Type | Required | Default value | Description |
| :---: | :---: | :---: | :---: | :---:  |
| `target` | `string` | `true` | `undefined` | Proxy target address, including **protocol**, **host** and **port**. |
| `pathFilter` | `string, string[], glob, glob[], Function` | `false` | `undefined` |Narrow down which requests should be proxied. |
| `pathRewrite` | `object/Function` | `false` | `undefined` | Rewrite target's url path. Object-keys will be used as RegExp to match paths. |
| `configureProxyRequest` | `Function` | `false` | `undefined` | Configure options of `proxyRequest`. More details see <a href="https://github.com/unjs/h3">built-in util proxyRequest of h3</a> |
| `enableLogger` | `boolean` | `false` | `true` | Whether to enable logger which is created by **consola**. |
| `loggerOptions` | `ConsolaOptions` | `false` | `{}` | Configure the options of [consola](https://github.com/unjs/consola). |



### pathFilter

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
    return path.match('^/api') && req.method === 'GET';
  };

  const apiProxy = createProxyEventHandler({
    target: 'http://www.example.org',
    pathFilter: pathFilter,
  });
  ```

### pathRewrite

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

### configureProxyRequest

```ts
createProxyEventHandler({
  // ...
  // the param `event` is H3Event
  configureProxyRequest(event) {
    // return your custom options of proxyRequest
    return {}
  }
})
```


# CHANGE LOG

SEE <a href="./CHANGELOG.md">CHANGE LOG</a>.