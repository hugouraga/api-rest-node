import { Gym, Prisma } from '@prisma/client'

export interface GymContractRepository {
  register(data: Prisma.GymCreateInput): Promise<Gym | null>
  findGymById(id: string): Promise<Gym | null>
}
