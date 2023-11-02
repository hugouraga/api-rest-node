import { UserAlreadyExistError } from '@/use-cases/users/errors/user-already-exist-error'
import { MakeRegisterUserCase } from '@/use-cases/users/factories/make-register-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { string, z } from 'zod'

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const registerBodySchema = z.object({
    name: string(),
    email: string().email(),
    password: string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)
  const registerUseCase = MakeRegisterUserCase()

  try {
    await registerUseCase.execute({ name, email, password })
    reply.status(201).send()
  } catch (error) {
    if (error instanceof UserAlreadyExistError)
      return reply.status(409).send({ message: 'user already exists' })

    throw error
  }
}
