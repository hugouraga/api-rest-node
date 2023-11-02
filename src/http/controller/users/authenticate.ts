import { InvalidCredentialsError } from '@/use-cases/users/errors/invalid-credentials-error'
import { MakeAuthenticateUseCase } from '@/use-cases/users/factories/make-authenticate-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = MakeAuthenticateUseCase()
    await authenticateUseCase.execute({
      email,
      password,
    })
    reply.status(200).send()
  } catch (err) {
    if (err instanceof InvalidCredentialsError)
      reply.status(401).send({ message: err.message })

    throw err
  }
}
