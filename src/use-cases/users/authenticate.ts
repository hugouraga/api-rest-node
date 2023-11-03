import { UsersContractRepository } from '@/repositories/contracts/contract-users-repository'
import { InvalidCredentialsError } from '../_errors/invalid-credentials-error'
import bcrypt from 'bcrypt'
import { User } from '@prisma/client'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersContractRepository) {}
  execute = async ({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> => {
    const user = await this.usersRepository.findUserByEmail(email)
    if (!user) throw new InvalidCredentialsError()
    const doesPasswordMatch = await bcrypt.compare(password, user.password)
    if (!doesPasswordMatch) throw new InvalidCredentialsError()

    return { user }
  }
}
