import { Gym, Prisma } from '@prisma/client'
import {
  FindManyNearby,
  GymContractRepository,
} from '../contracts/contract-gyms-repository'
import { randomUUID } from 'crypto'
import { getDistanceBetweenCoordinates } from '@/utils/getDistanceBetweenCoordinates'

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

  async searchMany(search: string) {
    const gyms = this.gyms.filter((gym) => gym.title.includes(search))
    return gyms
  }

  async findManyNearby({ longitude, latitude, page }: FindManyNearby) {
    const gyms = this.gyms
      .filter((gym) => {
        const distance = getDistanceBetweenCoordinates(
          { longitude: Number(longitude), latitude: Number(latitude) },
          { longitude: Number(gym.longitude), latitude: Number(gym.latitude) },
        )
        return distance < 10
      })
      .slice((page - 1) * 20, page * 20)

    return gyms
  }
}
