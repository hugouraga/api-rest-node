import bcrypt from 'bcrypt'
import { UsersContractRepository } from '@/repositories/contracts/contract-users-repository'
import { User } from '@prisma/client'
import { UserAlreadyExistError } from './../_errors/user-already-exist-error'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class UserRegisterUseCase {
  constructor(private UsersRepository: UsersContractRepository) {}
  execute = async ({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> => {
    const findUserEmail = await this.UsersRepository.findUserByEmail(email)
    if (findUserEmail) throw new UserAlreadyExistError()
    const passwordHash = await bcrypt.hash(password, 6)
    const user = await this.UsersRepository.register({
      name,
      email,
      password: passwordHash,
    })

    return { user }
  }
}
