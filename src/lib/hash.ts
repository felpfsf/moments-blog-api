import crypto from 'crypto'

interface PasswordProps {
  candidatePassword: string
  hash: string
  salt: string
}

export function hashPassword(password: string) {
  // Cria uma string para embaralhar a senha
  const salt = crypto.randomBytes(16).toString('hex')

  // Embaralha a senha usando o salt gerando o hash
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex')

  return { hash, salt }
}

export function verifyPassword({
  candidatePassword,
  hash,
  salt
}: PasswordProps) {
  // A senha é armazenada embaralhada, se o usuário digitar a senha corretamente o hash será o mesmo que está no DB
  const candidateHash = crypto
    .pbkdf2Sync(candidatePassword, salt, 1000, 64, 'sha512')
    .toString('hex')

  const result = candidateHash === hash

  return result
}
