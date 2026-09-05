import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import {
  createService,
  findActiveServiceById,
  findActiveServices,
  updateService,
  deleteService,
} from '../repositories/service-repository.js'

const ServiceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
}).openapi('Service')

const CreateServiceSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
}).openapi('CreateService')

const UpdateServiceSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
}).openapi('UpdateService')

const ServiceIdParamSchema = z.object({
  id: z.string().uuid(),
})

const serviceListRoute = createRoute({
  method: 'get',
  path: '/',
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

const serviceCreateRoute = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateServiceSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Service created',
      content: {
        'application/json': {
          schema: ServiceSchema,
        },
      },
    },
  },
})

const serviceGetRoute = createRoute({
  method: 'get',
  path: '/{id}',
  request: {
    params: ServiceIdParamSchema,
  },
  responses: {
    200: {
      description: 'Service found',
      content: {
        'application/json': {
          schema: ServiceSchema,
        },
      },
    },
    404: {
      description: 'Service not found',
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

const serviceUpdateRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  request: {
    params: ServiceIdParamSchema,
    body: {
      content: {
        'application/json': {
          schema: UpdateServiceSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Service updated',
      content: {
        'application/json': {
          schema: ServiceSchema,
        },
      },
    },
    404: {
      description: 'Service not found',
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
const serviceDeleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  request: {
    params: ServiceIdParamSchema,
  },
  responses: {
    204: {
      description: 'Service deleted',
    },
    404: {
      description: 'Service not found',
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

const servicesRoute = new OpenAPIHono()

servicesRoute.openapi(serviceListRoute, async (c) => {
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

servicesRoute.openapi(serviceCreateRoute, async (c) => {
  const body = c.req.valid('json')

  const service = await createService({
    name: body.name,
    description: body.description,
  })

  return c.json({
    id: service.id,
    name: service.name,
    description: service.description,
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
    deletedAt: service.deletedAt?.toISOString() ?? null,
  }, 201)
})

servicesRoute.openapi(serviceGetRoute, async (c) => {
  const { id } = c.req.valid('param')

  const service = await findActiveServiceById(id)

  if (!service) {
    return c.json({
      message: 'Service not found',
    }, 404)
  }

  return c.json({
    id: service.id,
    name: service.name,
    description: service.description,
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
    deletedAt: service.deletedAt?.toISOString() ?? null,
  }, 200)
})

servicesRoute.openapi(serviceUpdateRoute, async (c) => {
  const { id } = c.req.valid('param')
  const body = c.req.valid('json')

  const service = await updateService(id, {
    name: body.name,
    description: body.description,
  })

  if (!service) {
    return c.json({
      message: 'Service not found',
    }, 404)
  }

  return c.json({
    id: service.id,
    name: service.name,
    description: service.description,
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
    deletedAt: service.deletedAt?.toISOString() ?? null,
  }, 200)
})

servicesRoute.openapi(serviceDeleteRoute, async (c) => {
  const { id } = c.req.valid('param')

  const service = await deleteService(id)

  if (!service) {
    return c.json({
      message: 'Service not found',
    }, 404)
  }

  return c.body(null, 204)
})


export { servicesRoute }
