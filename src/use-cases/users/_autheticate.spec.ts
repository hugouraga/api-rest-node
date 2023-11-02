import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InvalidCredentialsError } from './..//errors/invalid-credentials-error'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import bcrypt from 'bcrypt'

describe('Authenticate Use Case', () => {
  let userRepository: InMemoryUsersRepository
  let authenticateUseCase: AuthenticateUseCase

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    authenticateUseCase = new AuthenticateUseCase(userRepository)
  })

  it('Should be able to authenticate', async () => {
    await userRepository.register({
      email: 'hugouraga62@gmail.com',
      name: 'hugo issao uraga',
      password: await bcrypt.hash('123456', 6),
    })

    const { user } = await authenticateUseCase.execute({
      email: 'hugouraga62@gmail.com',
      password: '123456',
    })

    expect(user.name).toEqual('hugo issao uraga')
  })

  it('should deny authorization when an email is invalid', async () => {
    await expect(async () => {
      await authenticateUseCase.execute({
        email: 'hugouraga62@gmail.com',
        password: await bcrypt.hash('123456', 6),
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should deny authorization when an password is invalid', async () => {
    await userRepository.register({
      email: 'hugouraga62@gmail.com',
      name: 'hugo issao uraga',
      password: await bcrypt.hash('123456', 6),
    })
    await expect(async () => {
      await authenticateUseCase.execute({
        email: 'hugouraga62@gmail.com',
        password: await bcrypt.hash('1232131', 6),
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
