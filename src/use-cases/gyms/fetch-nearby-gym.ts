import { GymContractRepository } from '@/repositories/contracts/contract-gyms-repository'
import { Gym } from '@prisma/client'

interface FetchNearbyGymRequest {
  userLatitude: string
  userLongitude: string
  page: number
}
interface FetchNearbyGymResponse {
  gyms: Gym[]
}

export class FetchNearbyGymUseCase {
  constructor(private gymRepository: GymContractRepository) {}

  execute = async ({
    userLatitude,
    userLongitude,
    page,
  }: FetchNearbyGymRequest): Promise<FetchNearbyGymResponse> => {
    const gyms = await this.gymRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
      page,
    })

    return { gyms }
  }
}
