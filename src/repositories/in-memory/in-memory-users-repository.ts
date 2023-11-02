import { Prisma, User } from '@prisma/client'
import { UsersContractRepository } from '../contracts/contract-users-repository'

export class InMemoryUsersRepository implements UsersContractRepository {
  public users: User[] = []

  async register(data: Prisma.UserCreateInput) {
    const user = {
      id: '1',
      name: data.name,
      email: data.email,
      password: data.password,
      created_at: new Date(),
      default_at: new Date(),
    }
    this.users.push(user)
    return user
  }

  async findUserByEmail(email: string) {
    const user = this.users.find((user) => user.email === email)
    return !user ? null : user
  }

  async findUserById(id: string) {
    const user = this.users.find((user) => user.id === id)
    return !user ? null : user
  }
}
