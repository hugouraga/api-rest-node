import { Prisma } from '@prisma/client'
import {
  CheckInContractRepository,
  FindCheckInsByUserIdOnDate,
  FindManyByUserId,
} from '../contracts/contract-check-ins-repository'
import { prisma } from '@/prisma'
import dayjs from 'dayjs'

export class CheckInsRepository implements CheckInContractRepository {
  async register(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data: {
        user_id: data.user_id,
        gym_id: data.gym_id,
        created_at: data.created_at ?? new Date(),
        check_in_at: data.check_in_at ?? new Date(),
        confirmed_at: data.confirmed_at ?? null,
      },
    })
    return checkIn
  }

  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    })
    return checkIn
  }

  async countByUserId(id: string): Promise<number> {
    const countCheckIn = await prisma.checkIn.count({
      where: {
        user_id: id,
      },
    })
    return countCheckIn
  }

  async findManyByUserId({ id, page }: FindManyByUserId) {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: id,
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return checkIns
  }

  async findByUserIdOnDate({ id, date }: FindCheckInsByUserIdOnDate) {
    const startOfTheDay = dayjs(date).hour(-3)
    const endOfTheDay = dayjs(date).hour(20).minute(59).second(59)

    const checkIn = prisma.checkIn.findFirst({
      where: {
        user_id: id,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })

    return checkIn
  }
}
