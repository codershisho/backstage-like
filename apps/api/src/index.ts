import { serve } from '@hono/node-server'
import { OpenAPIHono } from '@hono/zod-openapi'
import { Scalar } from '@scalar/hono-api-reference'
import { servicesRoute } from './routes/services.js'

const app = new OpenAPIHono()

app.route('/api/v1/services', servicesRoute)

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
  })
})

app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Backstage Like API',
    description: 'Backstage Like application API',
  },
  servers: [
    {
      url: 'http://localhost:3001',
    },
  ],
})

app.get(
  '/docs',
  Scalar({
    url: '/openapi.json',
  }),
)

const port = 3001

console.log(`API server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})