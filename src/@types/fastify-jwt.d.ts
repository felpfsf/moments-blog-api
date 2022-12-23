import '@fastify/jwt'
import 'fastify'
import { JWT } from '@fastify/jwt'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      sub: string
      id: string
      name: string
      email: string
    }
  }
}
