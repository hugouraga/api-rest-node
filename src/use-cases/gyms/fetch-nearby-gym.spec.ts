import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { expect, beforeEach, it, describe } from 'vitest'
import { FetchNearbyGymUseCase } from './fetch-nearby-gym'

describe('Fetch Nearby Gym Use Case', () => {
  let gymRepository: InMemoryGymRepository
  let searchGymUseCase: FetchNearbyGymUseCase

  beforeEach(async () => {
    gymRepository = new InMemoryGymRepository()
    searchGymUseCase = new FetchNearbyGymUseCase(gymRepository)

    for (let i = 1; i <= 22; i++) {
      await gymRepository.register({
        title: `gym javascript ${i}`,
        latitude: '-8.1416418',
        longitude: '-34.9087568',
        description: 'essa é a melhor academia para programadores',
      })
    }
  })

  it('should return to nearby gyms', async () => {
    const { gyms } = await searchGymUseCase.execute({
      userLatitude: '-8.1416418',
      userLongitude: '-34.9087568',
      page: 2,
    })
    expect(gyms).toHaveLength(2)
  })

  it('should not return to distant gyms', async () => {
    const { gyms } = await searchGymUseCase.execute({
      userLatitude: '7.930767',
      userLongitude: '-34.8265385',
      page: 1,
    })
    expect(gyms).toHaveLength(0)
  })
})
