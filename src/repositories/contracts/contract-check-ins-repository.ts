import { CheckIn, Prisma } from '@prisma/client'

export interface FindCheckInsByUserIdOnDate {
  id: string
  date: Date
}

export interface CheckInContractRepository {
  register(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findCheckInById(id: string): Promise<CheckIn | null>
  findCheckInsByUserId(id: string): Promise<CheckIn[] | null>
  findCheckInByUserIdOnDate({
    id,
    date,
  }: FindCheckInsByUserIdOnDate): Promise<CheckIn | null>
}
