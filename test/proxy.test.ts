import { describe, beforeEach, expect, it } from 'vitest'
import supertest from 'supertest'
import type { SuperTest, Test } from 'supertest'
import type { App } from 'h3'
import { createApp, toNodeListener, eventHandler } from 'h3'
import { createProxyEventHandler } from '../src'

describe('Validate proxy event handler', () => {
  let app: App
  let request: SuperTest<Test>

  beforeEach(() => {
    app = createApp({ debug: false })
    app.use(
      '/test',
      eventHandler(() => 'Hello World!')
    )
    request = supertest(toNodeListener(app))
  })

  const proxyEventHandler = createProxyEventHandler({
    target: 'http://127.0.0.1:3000',
    pathRewrite: {
      '/api': '',
    },
    pathFilter: ['/api/**'],
  })

  it('returns 200 OK if proxy request is success', async () => {
    app.use(eventHandler(proxyEventHandler))

    const res = await request.get('/api/test')

    expect(res.statusCode).toEqual(200)
  })
})
