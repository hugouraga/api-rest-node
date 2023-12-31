import { UsersContractRepository } from '@/repositories/contracts/contract-users-repository'
import { GymContractRepository } from '@/repositories/contracts/contract-gyms-repository'
import { CheckInContractRepository } from '@/repositories/contracts/contract-check-ins-repository'
import { CheckIn } from '@prisma/client'
import { getDistanceBetweenCoordinates } from '@/utils/getDistanceBetweenCoordinates'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { MaxDistanceError } from '../_errors/max-distance-error'
import { MaxNumberCheckInsError } from '../_errors/max-number-check-ins-error'

interface CheckInUseCaseRequest {
  user_id: string
  gym_id: string
  user_latitude: string
  user_longitude: string
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInRegisterUseCase {
  constructor(
    private userRepository: UsersContractRepository,
    private gymRepository: GymContractRepository,
    private checkInRepository: CheckInContractRepository,
  ) {}

  execute = async ({
    user_id,
    gym_id,
    user_latitude,
    user_longitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> => {
    const user = await this.userRepository.findUserById(user_id)
    if (!user) throw new ResourceNotFoundError()
    const gym = await this.gymRepository.findGymById(gym_id)
    if (!gym) throw new ResourceNotFoundError()

    const distanceInKilometers = getDistanceBetweenCoordinates(
      { latitude: Number(user_latitude), longitude: Number(user_longitude) },
      { latitude: Number(gym.latitude), longitude: Number(gym.longitude) },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distanceInKilometers > MAX_DISTANCE_IN_KILOMETERS)
      throw new MaxDistanceError()
    const checkInOnSameDay = await this.checkInRepository.findByUserIdOnDate({
      id: user.id,
      date: new Date(),
    })

    if (checkInOnSameDay) throw new MaxNumberCheckInsError()

    const checkIn = await this.checkInRepository.register({
      user_id,
      gym_id,
      check_in_at: new Date(),
    })

    if (!checkIn) throw new ResourceNotFoundError()

    return {
      checkIn,
    }
  }
}
