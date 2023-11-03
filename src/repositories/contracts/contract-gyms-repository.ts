import { Gym, Prisma } from '@prisma/client'

export interface FindManyNearby {
  longitude: string
  latitude: string
  page: number
}

export interface GymContractRepository {
  register(data: Prisma.GymCreateInput): Promise<Gym | null>
  findGymById(id: string): Promise<Gym | null>
  searchMany(search: string): Promise<Gym[] | []>
  findManyNearby({
    latitude,
    longitude,
    page,
  }: FindManyNearby): Promise<Gym[] | []>
}
