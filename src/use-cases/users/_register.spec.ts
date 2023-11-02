import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { UserRegisterUseCase } from './register-user'
import { compare } from 'bcrypt'

let usersRepository: InMemoryUsersRepository
let registerUseCase: UserRegisterUseCase

describe('register use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    registerUseCase = new UserRegisterUseCase(usersRepository)
  })

  it('should hash user password upon registration', async () => {
    const { user } = await registerUseCase.execute({
      email: 'hugouraga62@gmail.com',
      name: 'Hugo Issao Uraga',
      password: '123456',
    })
    const isPasswordCorrectlyHashed = await compare('123456', user.password)
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'hugouraga62@gmail.com'
    await registerUseCase.execute({
      email,
      name: 'Hugo Issao Uraga',
      password: '123456',
    })
    await expect(
      async () =>
        await registerUseCase.execute({
          email,
          name: 'Hugo Issao Uraga',
          password: '123456',
        }),
    ).rejects.toThrowError('user already exists')
  })

  it('should be able to register', async () => {
    const { user } = await registerUseCase.execute({
      email: 'hugouraga62@gmail.com',
      name: 'Hugo Issao Uraga',
      password: '123456',
    })
    expect(user.name).toEqual('Hugo Issao Uraga')
  })
})
