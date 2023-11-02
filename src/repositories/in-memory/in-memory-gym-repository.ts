import { Gym, Prisma } from '@prisma/client'
import { GymContractRepository } from '../contracts/contract-gyms-repository'
import { randomUUID } from 'crypto'

export class InMemoryGymRepository implements GymContractRepository {
  private gyms: Gym[] = []

  async register(data: Prisma.GymUncheckedCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description || null,
      latitude: data.latitude,
      longitude: data.longitude,
      created_at: new Date(),
      updated_at: new Date(),
    }
    this.gyms.push(gym)
    return gym
  }

  async findGymById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id)
    return gym || null
  }
}
