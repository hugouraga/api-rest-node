import { describe, expect, it, beforeEach } from 'vitest'
import { GymRegisterUseCase } from './register-gym'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'

describe('Register Gym Use Case', () => {
  let gymRepository: InMemoryGymRepository
  let gymUseCase: GymRegisterUseCase

  beforeEach(() => {
    gymRepository = new InMemoryGymRepository()
    gymUseCase = new GymRegisterUseCase(gymRepository)
  })

  it('should be possible to register a gym', async () => {
    const { gym } = await gymUseCase.execute({
      title: 'Gym Javascript',
      latitude: '-8.1416418',
      longitude: '-34.9280550',
    })

    expect(gym.title).toEqual('Gym Javascript')
  })
})
