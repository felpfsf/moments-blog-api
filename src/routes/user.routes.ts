import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  deleteUserController,
  getUsersController,
  loginController,
  registerUserController,
  updateUserController
} from '../controllers/user.controller'
import { authenticate } from '../lib/authenticate'
import {
  loginSchema,
  userPathParams,
  userSchema,
  userUpdateSchema
} from '../middlewares/user.schema'

export async function userRoutes(server: FastifyInstance) {
  server.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/register',
    schema: {
      body: userSchema,
    },
    handler: registerUserController
  })

  server.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      params: userPathParams
    },
    handler: deleteUserController
  })

  server.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/login',
    schema: {
      body: loginSchema
    },
    handler: loginController
  })

  server.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      params: userPathParams,
      body: userUpdateSchema
    },
    onRequest: [authenticate],
    handler: updateUserController
  })

  server.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/dashboard',
    onRequest: [authenticate],
    handler: async request => {
      return { user: request.user }
    }
  })

  server.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    onRequest: [authenticate],
    handler: getUsersController
  })
}
