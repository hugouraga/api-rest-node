import { UsersContractRepository } from '@/repositories/contracts/contract-users-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'

interface GetUserProfileRequest {
  id: string
}
interface GetUserProfileResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private userRepository: UsersContractRepository) {}

  execute = async ({
    id,
  }: GetUserProfileRequest): Promise<GetUserProfileResponse> => {
    const user = await this.userRepository.findUserById(id)
    if (!user) throw new ResourceNotFoundError()
    return { user }
  }
}
