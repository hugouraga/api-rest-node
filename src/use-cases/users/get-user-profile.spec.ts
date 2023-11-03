import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { User } from '@prisma/client'

describe('GetUserProfile Use Case', () => {
  let userRepository: InMemoryUsersRepository
  let getUserProfileUseCase: GetUserProfileUseCase
  let userRegister: User

  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    getUserProfileUseCase = new GetUserProfileUseCase(userRepository)

    userRegister = await userRepository.register({
      name: 'hugo test vitest',
      email: 'testVitest@gmail.com',
      password: '123456',
    })
  })

  it('should return user data correctly', async () => {
    const { user } = await getUserProfileUseCase.execute({
      id: userRegister.id,
    })

    expect(user.name).toEqual('hugo test vitest')
    expect(user.email).toEqual('testVitest@gmail.com')
  })

  it('should return that user data does not exist', async () => {
    await expect(async () => {
      await getUserProfileUseCase.execute({
        id: 'resource not found',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
