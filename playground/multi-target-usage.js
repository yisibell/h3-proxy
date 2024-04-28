import { createServer } from 'node:http'
import { createApp, eventHandler, toNodeListener } from 'h3'
import { createProxyEventHandler } from '../lib/index.esm.js'
import consola from 'consola'

const app = createApp()

const port = process.env.PORT || 3000

const proxyEventHandler = createProxyEventHandler([
  {
    target: `http://127.0.0.1:${port}`,
    pathRewrite: {
      '^/api': '',
    },
    pathFilter: ['/api/**'],
    // enableLogger: false,
    changeOrigin: true,
  },
  {
    target: `http://127.0.0.1:${port}/other-api-module`,
    pathRewrite: {
      '^/other-api': '',
    },
    pathFilter: ['/other-api/**'],
    // enableLogger: false,
    changeOrigin: true,
  },
])

app.use(eventHandler(proxyEventHandler))

app.use(
  '/test',
  eventHandler(() => 'Hello world!'),
)

app.use(
  '/other-api-module/some/path',
  eventHandler(() => 'Hello other API module!'),
)

createServer(toNodeListener(app)).listen(port, () => {
  consola.success(`Your app server start at: http://127.0.0.1:${port}`)
})
