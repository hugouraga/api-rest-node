import { CheckInContractRepository } from '@/repositories/contracts/contract-check-ins-repository'
import { UsersContractRepository } from '@/repositories/contracts/contract-users-repository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface FetchCheckInsRequest {
  user_id: string
}

interface FetchCheckInsResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsUseCase {
  constructor(
    private userRepository: UsersContractRepository,
    private checkInRepository: CheckInContractRepository,
  ) {}

  execute = async ({
    user_id,
  }: FetchCheckInsRequest): Promise<FetchCheckInsResponse> => {
    const user = await this.userRepository.findUserById(user_id)
    if (!user) throw new ResourceNotFoundError()
    const checkIns = await this.checkInRepository.findCheckInsByUserId(user_id)
    if (!checkIns) throw new ResourceNotFoundError()

    return {
      checkIns,
    }
  }
}
