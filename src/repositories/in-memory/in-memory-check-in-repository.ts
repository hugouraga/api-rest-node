import { CheckIn, Prisma } from '@prisma/client'
import {
  CheckInContractRepository,
  FindCheckInsByUserIdOnDate,
  FindManyByUserId,
} from '../contracts/contract-check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInRepository implements CheckInContractRepository {
  public checkIns: CheckIn[] = []

  async register(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      check_in_at: new Date(),
      confirmed_at: data.confirmed_at ? new Date(data.confirmed_at) : null,
      created_at: new Date(),
    }

    this.checkIns.push(checkIn)
    return checkIn
  }

  async findById(id: string) {
    const checkIn = this.checkIns.find((checkIn) => checkIn.id === id)
    return checkIn || null
  }

  async findManyByUserId({ id, page }: FindManyByUserId) {
    const checkIns = this.checkIns
      .filter((checkIn) => checkIn.user_id === id)
      .slice((page - 1) * 20, page * 20)
    return checkIns || null
  }

  async findByUserIdOnDate({ id, date }: FindCheckInsByUserIdOnDate) {
    const startOfTheDay = dayjs(date).hour(-3)
    const endOfTheDay = dayjs(date).hour(20).minute(59).second(59)
    const checkIns = this.checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)
      return (checkIn.user_id === id && isOnSameDate) ?? null
    })
    return checkIns || null
  }

  async countByUserId(id: string): Promise<number> {
    const checkInsCount = this.checkIns.filter(
      (checkIn) => checkIn.user_id === id,
    ).length
    return checkInsCount || 0
  }
}
