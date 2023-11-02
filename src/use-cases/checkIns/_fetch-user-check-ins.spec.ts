import { InMemoryCheckInRepository } from '../../repositories/in-memory/in-memory-check-in-repository'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { InMemoryGymRepository } from '../../repositories/in-memory/in-memory-gym-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchUserCheckInsUseCase } from './fetch-user-check-ins'
import { User } from '@prisma/client'

describe('Get User Check-ins Use Case', () => {
  let userRepository: InMemoryUsersRepository
  let gymRepository: InMemoryGymRepository
  let checkInRepository: InMemoryCheckInRepository
  let fetchUserCheckInsUseCase: FetchUserCheckInsUseCase
  let user: User

  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    gymRepository = new InMemoryGymRepository()
    checkInRepository = new InMemoryCheckInRepository()
    fetchUserCheckInsUseCase = new FetchUserCheckInsUseCase(
      userRepository,
      checkInRepository,
    )

    user = await userRepository.register({
      email: 'hugouraga62@gmail.com',
      name: 'Hugo Issao Uraga',
      password: '123456',
    })
  })

  it('should be possible to return user check-ins', async () => {
    for (let i = 0; i < 5; i++) {
      const gym = await gymRepository.register({
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

    const { checkIns } = await fetchUserCheckInsUseCase.execute({
      user_id: user.id,
    })

    expect(checkIns).toHaveLength(5)
  })
})
