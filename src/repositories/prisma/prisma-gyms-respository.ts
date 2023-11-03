import { Gym, Prisma } from '@prisma/client'
import { prisma } from '@/prisma'
import {
  FindManyNearby,
  GymContractRepository,
} from '../contracts/contract-gyms-repository'

export class GymsRepository implements GymContractRepository {
  async register(data: Prisma.GymCreateInput) {
    return await prisma.gym.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    })
  }

  async findGymById(id: string) {
    return await prisma.gym.findUnique({
      where: { id },
    })
  }

  async searchMany(search: string) {
    return await prisma.gym.findMany({
      where: {
        title: {
          contains: search,
        },
      },
    })
  }

  async findManyNearby({ latitude, longitude, page }: FindManyNearby) {
    const gyms = await prisma.$queryRaw<Gym[]>`
    SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10`

    return gyms
  }
}
