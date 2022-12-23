import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { version } from '../package.json'

import { userRoutes } from './routes/user.routes'

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from 'fastify-type-provider-zod'

const port = (process.env.PORT as unknown as number) || 3333

export const server = Fastify({
  logger: true
})

async function bootstrap() {
  await server.register(jwt, {
    secret: process.env.JWT_SECRET as string
  })

  server.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify()
      } catch (error) {
        return reply.send(error)
      }
    }
  )

  await server.register(cors, { origin: true })
  // Add schema validator and serializer
  server.setValidatorCompiler(validatorCompiler)
  server.setSerializerCompiler(serializerCompiler)

  // Formata os erros do zod pq estavam estranho \n path tal \n lalala
  server.setErrorHandler((error, request, reply) => {
    const toSend = {
      message: 'Validation error',
      errors: JSON.parse(error.message),
      statusCode: error.statusCode || 500
    }

    reply.code(toSend.statusCode).send(toSend)
  })

  // Swagger docs, JWT not working properly
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Moments Blog API',
        description: 'Uma API REST simples de blog',
        version
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    },
    transform: jsonSchemaTransform
  })

  server.register(fastifySwaggerUi, {
    routePrefix: '/documentation'
  })

  await server.register(userRoutes, { prefix: '/users' })

  await server
    .listen({ port: port })
    .then(address => console.log(`Server listening on ${address}`))
    .catch(error => {
      console.log(`Error starting server: ${error}`)
      process.exit(1)
    })
}

bootstrap()
