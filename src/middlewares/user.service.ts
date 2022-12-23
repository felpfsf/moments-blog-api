import { hashPassword } from '../lib/hash'
import { prisma } from '../lib/prisma'
import { CreateUserSchema, UserUpdateSchema } from './user.schema'

export async function createUser(input: CreateUserSchema) {
  const { password, passwordConfirmation, ...rest } = input

  const { hash, salt } = hashPassword(password)

  const data = { ...rest, salt, password: hash }

  const user = await prisma.user.create({
    data,
    select: {
      id: true,
      name: true,
      email: true
    }
  })

  return user
}

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: {
      id
    },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      profileImg: true,
      createdAt: true
    }
  })
}

export async function updateUser(id: string, input: UserUpdateSchema) {
  const { password, passwordConfirmation, ...rest } = input

  const { hash, salt } = hashPassword(password)

  const user = await prisma.user.update({
    where: {
      id
    },
    data: { ...rest, salt, password: hash },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      profileImg: true,
      createdAt: true,
      updateAt: true
    }
  })

  return user
}

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email
    }
  })
}

export async function findUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      profileImg: true,
      createdAt: true,
      updateAt: true
    }
  })
}
