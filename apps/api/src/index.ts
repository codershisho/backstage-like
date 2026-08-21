import { serve } from '@hono/node-server'
import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from 'zod'
import { findUserById } from '@backstage-like/db'
import { Scalar } from '@scalar/hono-api-reference'

const app = new OpenAPIHono()

const UserSchema = z.object({
  id: z.string().openapi({
    example: 'user-001',
  }),
  name: z.string().openapi({
    example: 'Taro',
  }),
  email: z.email().openapi({
    example: 'taro@example.com',
  }),
}).openapi('User')

const userRoute = createRoute({
  method: 'get',
  path: '/api/v1/users/{id}',
  request: {
    params: z.object({
      id: z.string().openapi({
        example: 'user-001',
      }),
    }),
  },
  responses: {
    200: {
      description: 'User information',
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
    },
    404: {
      description: 'User not found',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
  },
})

app.openapi(userRoute, async (c) => {
  const { id } = c.req.valid('param')

  const user = await findUserById(id)

  if (!user) {
    return c.json({
      message: 'User not found',
    }, 404)
  }

  return c.json(user, 200)
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