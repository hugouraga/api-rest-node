import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { beforeEach, describe, it, expect } from 'vitest'
import { SearchGymUseCase } from './search-gym'

describe('Search Gym Use Case', () => {
  let gymRepository: InMemoryGymRepository
  let searchGymUseCase: SearchGymUseCase

  beforeEach(async () => {
    gymRepository = new InMemoryGymRepository()
    searchGymUseCase = new SearchGymUseCase(gymRepository)

    for (let i = 1; i <= 10; i++) {
      await gymRepository.register({
        title: `gym javascript ${i}`,
        latitude: '9999',
        longitude: '9999',
        description: 'essa é a melhor academia para programadores',
      })
    }
  })

  it('should be possible to search for academies by title', async () => {
    const { gyms } = await searchGymUseCase.execute({ search: 'javascript' })
    expect(gyms).toHaveLength(10)
  })

  it('should return an empty list for unregistered gym', async () => {
    const { gyms } = await searchGymUseCase.execute({ search: 'php' })
    expect(gyms).toHaveLength(0)
  })
})
