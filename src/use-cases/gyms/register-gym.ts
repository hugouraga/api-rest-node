import { GymContractRepository } from '@/repositories/contracts/contract-gyms-repository'
import { Gym } from '@prisma/client'

interface GymRegisterUseCaseRequest {
  title: string
  description?: string
  longitude: string
  latitude: string
}

interface GymRegisterUseCaseResponse {
  gym: Gym
}

export class GymRegisterUseCase {
  constructor(private gymRepository: GymContractRepository) {}

  execute = async (
    data: GymRegisterUseCaseRequest,
  ): Promise<GymRegisterUseCaseResponse> => {
    const gym = await this.gymRepository.register({
      title: data.title,
      description: data.description ?? '',
      latitude: data.latitude,
      longitude: data.longitude,
    })

    if (!gym) throw new Error()

    return { gym }
  }
}
