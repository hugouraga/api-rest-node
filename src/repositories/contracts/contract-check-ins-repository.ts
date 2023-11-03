import { CheckIn, Prisma } from '@prisma/client'

export interface FindCheckInsByUserIdOnDate {
  id: string
  date: Date
}

export interface FindManyByUserId {
  id: string
  page: number
}

export interface CheckInContractRepository {
  register(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findById(id: string): Promise<CheckIn | null>
  countByUserId(id: string): Promise<number>
  findManyByUserId({ id, page }: FindManyByUserId): Promise<CheckIn[] | []>
  findByUserIdOnDate({
    id,
    date,
  }: FindCheckInsByUserIdOnDate): Promise<CheckIn | null>
}
