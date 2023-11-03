import { CheckInContractRepository } from '@/repositories/contracts/contract-check-ins-repository'
import { UsersContractRepository } from '@/repositories/contracts/contract-users-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'

interface GetUserMetricsUseCaseRequest {
  userId: string
}

interface GetUserMetricsUseCaseResponse {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(
    private userRepository: UsersContractRepository,
    private checkInRepository: CheckInContractRepository,
  ) {}

  execute = async ({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> => {
    const user = await this.userRepository.findUserById(userId)
    if (!user) throw new ResourceNotFoundError()
    const checkInsCount = await this.checkInRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
