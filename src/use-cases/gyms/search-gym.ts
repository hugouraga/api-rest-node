import { GymContractRepository } from '@/repositories/contracts/contract-gyms-repository'
import { Gym } from '@prisma/client'

interface SearchGymUseCaseRequest {
  search: string
}
interface SearchGymUseResponse {
  gyms: Gym[]
}

export class SearchGymUseCase {
  constructor(private gymRepository: GymContractRepository) {}

  execute = async ({
    search,
  }: SearchGymUseCaseRequest): Promise<SearchGymUseResponse> => {
    const gyms = await this.gymRepository.searchMany(search)

    return {
      gyms,
    }
  }
}
