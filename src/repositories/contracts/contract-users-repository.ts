import { Prisma, User } from '@prisma/client'

export interface UsersContractRepository {
  register(data: Prisma.UserCreateInput): Promise<User>
  findUserByEmail(email: string): Promise<User | null>
  findUserById(id: string): Promise<User | null>
}
