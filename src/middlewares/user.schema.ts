import { z } from 'zod'

const userCoreSchema = {
  name: z.string().min(3, 'Nome é obrigatório'),
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('Informe um email válido')
}

export const userSchema = z
  .object({
    ...userCoreSchema,
    password: z.string().min(6, 'Precisa conter ao menos 6 caracteres').max(64),
    passwordConfirmation: z.string({
      required_error: 'Confirmação de senha é obrigatória'
    })
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: 'As senhas precisam ser iguais',
    path: ['passwordConfirmation']
  })

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('Informe um email válido'),
  password: z.string().min(6).max(64)
})

export const userUpdateSchema = z
  .object({
    ...userCoreSchema,
    password: z.string().min(6, 'Precisa conter ao menos 6 caracteres').max(64),
    passwordConfirmation: z.string(),
    bio: z.string(),
    profileImg: z.string()
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: 'As senhas precisam ser iguais',
    path: ['passwordConfirmation']
  })

export const userPathParams = z.object({
  id: z.string()
})

export const userResponseSchema = z.object({
  id: z.string(),
  ...userCoreSchema
})

export type CreateUserSchema = z.infer<typeof userSchema>
export type UserPathParams = z.infer<typeof userPathParams>
export type LoginUserSchema = z.infer<typeof loginSchema>
export type UserUpdateSchema = z.infer<typeof userUpdateSchema>

// export const models = {
//   userSchema,
//   userResponseSchema,
//   userPathParams
// }
