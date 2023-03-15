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

- Powerd by built-in `proxyRequest` of `h3`.
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

const proxyEventHandler = createProxyEventHandler({
  target: 'http://127.0.0.1:3000',
  pathRewrite: {
    '/api': '',
  },
  pathFilter: ['/api/**'],
})

app.use(
  '/test',
  eventHandler(() => 'Hello world!')
)

app.use(eventHandler(proxyEventHandler))

createServer(toNodeListener(app)).listen(process.env.PORT || 3000)
```

# APIs

## createProxyEventHandler

Create a `h3` event handler that can handle proxy requests.

# CHANGE LOG

SEE <a href="./CHANGELOG.md">CHANGE LOG</a>.