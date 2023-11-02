import { Gym, User } from '@prisma/client'
import { InMemoryCheckInRepository } from '../../repositories/in-memory/in-memory-check-in-repository'
import { InMemoryGymRepository } from '../../repositories/in-memory/in-memory-gym-repository'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { CheckInRegisterUseCase } from './check-in'
import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'

describe('Register Check In Use Case', () => {
  let userRepository: InMemoryUsersRepository
  let gymRepository: InMemoryGymRepository

  let checkInRepository: InMemoryCheckInRepository
  let checkInRegisterUseCase: CheckInRegisterUseCase

  let user: User
  let gym: Gym

  beforeEach(async () => {
    vi.useFakeTimers()

    userRepository = new InMemoryUsersRepository()
    gymRepository = new InMemoryGymRepository()
    checkInRepository = new InMemoryCheckInRepository()
    checkInRegisterUseCase = new CheckInRegisterUseCase(
      userRepository,
      gymRepository,
      checkInRepository,
    )

    user = await userRepository.register({
      email: 'hugouraga62@gmail.com',
      name: 'Hugo Issao Uraga',
      password: '123456',
    })

    gym = await gymRepository.register({
      latitude: '-8.1416418',
      longitude: '-34.9087568',
      title: 'gym javascript',
      description: 'essa é a melhor academia para programadores',
    })
  })

  afterEach(async () => {
    vi.useRealTimers()
  })

  it('Should be possible to check in', async () => {
    const { checkIn } = await checkInRegisterUseCase.execute({
      gym_id: gym.id,
      user_id: user.id,
      user_latitude: '-8.1416418',
      user_longitude: '-34.9080550',
    })

    expect(checkIn.gym_id).toEqual(gym.id)
    expect(checkIn.user_id).toEqual(user.id)
    expect(checkIn.confirmed_at).toEqual(null)
  })

  it('should not be possible to check in twice on the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 12, 8, 0, 0))

    await checkInRegisterUseCase.execute({
      gym_id: gym.id,
      user_id: user.id,
      user_latitude: '-8.1416418',
      user_longitude: '-34.9080550',
    })

    await expect(async () => {
      await checkInRegisterUseCase.execute({
        gym_id: gym.id,
        user_id: user.id,
        user_latitude: '-8.1416418',
        user_longitude: '-34.9080550',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should be possible to check in on two different dates', async () => {
    vi.setSystemTime(new Date(2023, 0, 12, 13, 0, 0))

    await checkInRegisterUseCase.execute({
      gym_id: gym.id,
      user_id: user.id,
      user_latitude: '-8.1416418',
      user_longitude: '-34.9080550',
    })

    vi.setSystemTime(new Date(2023, 0, 13, 13, 0, 0))

    const { checkIn } = await checkInRegisterUseCase.execute({
      gym_id: gym.id,
      user_id: user.id,
      user_latitude: '-8.1416418',
      user_longitude: '-34.9080550',
    })

    expect(checkIn.id).toEqual(expect.any(String))
    expect(checkIn.gym_id).toEqual(gym.id)
    expect(checkIn.user_id).toEqual(user.id)
  })

  it('will not be possible to check in due to the distance', async () => {
    expect(async () => {
      await checkInRegisterUseCase.execute({
        gym_id: gym.id,
        user_id: user.id,
        user_latitude: '-8.1416418',
        user_longitude: '-34.9280550',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('Should not be possible to check-in to an invalid gym', async () => {
    expect(async () => {
      await checkInRegisterUseCase.execute({
        gym_id: 'gym not found',
        user_id: user.id,
        user_latitude: '9990',
        user_longitude: '9990',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('Should not be possible to check-in to an invalid user', async () => {
    expect(async () => {
      await checkInRegisterUseCase.execute({
        gym_id: gym.id,
        user_id: 'user not found',
        user_latitude: '9990',
        user_longitude: '9990',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
