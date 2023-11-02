import { UsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate'

export const MakeAuthenticateUseCase = () => {
  const authenticateRepository = new UsersRepository()
  const authenticateUseCase = new AuthenticateUseCase(authenticateRepository)
  return authenticateUseCase
}
