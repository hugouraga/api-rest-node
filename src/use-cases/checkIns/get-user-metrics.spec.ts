import { InMemoryCheckInRepository } from '../../repositories/in-memory/in-memory-check-in-repository'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { InMemoryGymRepository } from '../../repositories/in-memory/in-memory-gym-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { User } from '@prisma/client'
import { GetUserMetricsUseCase } from './get-user-metrics'

describe('Get User Check-ins Use Case', () => {
  let userRepository: InMemoryUsersRepository
  let gymRepository: InMemoryGymRepository
  let checkInRepository: InMemoryCheckInRepository
  let getUserMetricsUseCase: GetUserMetricsUseCase
  let user: User

  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    gymRepository = new InMemoryGymRepository()
    checkInRepository = new InMemoryCheckInRepository()
    getUserMetricsUseCase = new GetUserMetricsUseCase(
      userRepository,
      checkInRepository,
    )

    user = await userRepository.register({
      email: 'hugouraga62@gmail.com',
      name: 'Hugo Issao Uraga',
      password: '123456',
    })

    for (let i = 1; i <= 5; i++) {
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

  it('should return the number of check-ins performed by the user', async () => {
    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: user.id,
    })
    expect(checkInsCount).toEqual(5)
  })
})
