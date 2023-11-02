import { Prisma } from '@prisma/client'
import { UsersContractRepository } from '../contracts/contract-users-repository'
import { prisma } from '@/prisma'

export class UsersRepository implements UsersContractRepository {
  async register(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({ data })
    return user
  }

  async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    return user
  }

  async findUserById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } })
    return user
  }
}
