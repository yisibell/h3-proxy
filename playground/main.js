import { createServer } from 'node:http'
import { createApp, eventHandler, toNodeListener } from 'h3'
import { createProxyEventHandler } from '../lib/index.esm.js'

const app = createApp()

const port = process.env.PORT || 3000

const proxyEventHandler = createProxyEventHandler({
  target: `http://127.0.0.1:${port}`,
  pathRewrite: {
    '^/api': '',
  },
  pathFilter: ['/api/**'],
  // enableLogger: false,
  changeOrigin: true
})

app.use(
  '/test',
  eventHandler(() => 'Hello world!')
)

app.use(eventHandler(proxyEventHandler))

createServer(toNodeListener(app)).listen(port)
