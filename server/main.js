import { createServer } from 'node:http'
import { createApp, eventHandler, toNodeListener } from 'h3'
import { createProxyEventHandler } from '../lib/index.esm.js'

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
