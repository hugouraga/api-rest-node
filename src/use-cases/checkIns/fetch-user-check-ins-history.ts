import { CheckInContractRepository } from '@/repositories/contracts/contract-check-ins-repository'
import { UsersContractRepository } from '@/repositories/contracts/contract-users-repository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface FetchCheckInsHistoryUseCaseRequest {
  userId: string
  page: number
}

interface FetchCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(
    private userRepository: UsersContractRepository,
    private checkInRepository: CheckInContractRepository,
  ) {}

  execute = async ({
    userId,
    page,
  }: FetchCheckInsHistoryUseCaseRequest): Promise<FetchCheckInsHistoryUseCaseResponse> => {
    const user = await this.userRepository.findUserById(userId)
    if (!user) throw new ResourceNotFoundError()
    const checkIns = await this.checkInRepository.findManyByUserId({
      id: userId,
      page,
    })

    return {
      checkIns,
    }
  }
}
