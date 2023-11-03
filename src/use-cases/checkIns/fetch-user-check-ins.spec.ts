import { InMemoryCheckInRepository } from '../../repositories/in-memory/in-memory-check-in-repository'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { InMemoryGymRepository } from '../../repositories/in-memory/in-memory-gym-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'
import { User } from '@prisma/client'

describe('Get User Check-ins Use Case', () => {
  let userRepository: InMemoryUsersRepository
  let gymRepository: InMemoryGymRepository
  let checkInRepository: InMemoryCheckInRepository
  let fetchUserCheckInsUseCase: FetchUserCheckInsHistoryUseCase
  let user: User

  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    gymRepository = new InMemoryGymRepository()
    checkInRepository = new InMemoryCheckInRepository()
    fetchUserCheckInsUseCase = new FetchUserCheckInsHistoryUseCase(
      userRepository,
      checkInRepository,
    )

    user = await userRepository.register({
      email: 'hugouraga62@gmail.com',
      name: 'Hugo Issao Uraga',
      password: '123456',
    })

    for (let i = 1; i <= 22; i++) {
      const gym = await gymRepository.register({
        id: `gym ${i}`,
        title: `gym javascript ${i}`,
        latitude: '9999',
        longitude: '9999',
        description: 'essa é a melhor academia para programadores',
      })

      await checkInRepository.register({
        gym_id: gym.id,
        user_id: user.id,
        check_in_at: new Date(),
      })
    }
  })

  it('should be possible to return user check-ins', async () => {
    const { checkIns } = await fetchUserCheckInsUseCase.execute({
      userId: user.id,
      page: 1,
    })
    expect(checkIns).toHaveLength(20)
  })

  it('should be possible to search for check-ins by pagination', async () => {
    const { checkIns } = await fetchUserCheckInsUseCase.execute({
      userId: user.id,
      page: 2,
    })
    expect(checkIns).toHaveLength(2)
  })
})
