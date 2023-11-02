import { UsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserRegisterUseCase } from '../register-user'

export const MakeRegisterUserCase = () => {
  const userRepository = new UsersRepository()
  const registerUseCase = new UserRegisterUseCase(userRepository)
  return registerUseCase
}
