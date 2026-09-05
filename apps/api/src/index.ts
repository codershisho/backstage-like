import { serve } from '@hono/node-server'
import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { Scalar } from '@scalar/hono-api-reference'
import { z } from 'zod'
import { findActiveServices } from '@backstage-like/db'

const app = new OpenAPIHono()

const ServiceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
}).openapi('Service')

const serviceListRoute = createRoute({
  method: 'get',
  path: '/api/v1/services',
  responses: {
    200: {
      description: 'List of services',
      content: {
        'application/json': {
          schema: z.object({
            services: z.array(ServiceSchema),
          }),
        },
      },
    },
  },
})

app.openapi(serviceListRoute, async (c) => {
  const result = await findActiveServices()

  return c.json({
    services: result.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
      deletedAt: service.deletedAt?.toISOString() ?? null,
    })),
  }, 200)
})

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