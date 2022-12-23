import { FastifyReply, FastifyRequest } from 'fastify'
import { server } from '../server'
import { ZodError } from 'zod'
import { verifyPassword } from '../lib/hash'
import {
  CreateUserSchema,
  LoginUserSchema,
  UserPathParams,
  UserUpdateSchema
} from '../middlewares/user.schema'
import {
  createUser,
  deleteUser,
  findUserByEmail,
  findUsers,
  updateUser
} from '../middlewares/user.service'

export async function registerUserController(
  request: FastifyRequest<{ Body: CreateUserSchema }>,
  reply: FastifyReply
) {
  const body = request.body

  try {
    const temp = await findUserByEmail(body.email)

    if (temp) {
      return reply.status(500).send({
        message: 'Usuário já registrado com esse e-mail'
      })
    }

    const user = await createUser(body)

    return reply
      .status(201)
      .send({ message: 'Usuário registrado com sucesso', user })
  } catch (error) {
    console.log(error)
    if (error instanceof ZodError) {
      return reply.status(500).send({
        message: 'Validation error',
        errors: JSON.parse(error.message)
      })
    } else if (error instanceof Error) {
      return reply
        .status(500)
        .send({ message: 'Algo deu errado, tente mais tarde' })
    }
  }
}

export async function deleteUserController(
  request: FastifyRequest<{ Params: UserPathParams }>,
  reply: FastifyReply
) {
  const { id } = request.params

  const deletedUser = await deleteUser(id)

  return reply
    .status(200)
    .send({ message: 'Usuário apagado do sistema', deletedUser })
}

export async function loginController(
  request: FastifyRequest<{ Body: LoginUserSchema }>,
  reply: FastifyReply
) {
  const body = request.body

  const user = await findUserByEmail(body.email)

  if (!user) {
    return reply.status(401).send({
      success: false,
      message: 'Nenhum usuário registrado com esse e-mail'
    })
  }

  const correctPassword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password
  })

  if (correctPassword) {
    const { password, salt, ...rest } = user
    const accessToken = server.jwt.sign(rest, { expiresIn: 7, sub: user.id })
    return reply.status(200).send({
      accessToken
    })
    
  }

  return reply.status(401).send({
    message: 'Email ou senha inválida'
  })
}

export async function updateUserController(
  request: FastifyRequest<{ Params: UserPathParams; Body: UserUpdateSchema }>,
  reply: FastifyReply
) {
  const { id } = request.params
  const body = request.body

  const user = await updateUser(id, body)

  return reply.status(201).send({
    message: 'Dados alterados com sucesso',
    user
  })
}

export async function getUsersController() {
  const users = await findUsers()
  return users
}
