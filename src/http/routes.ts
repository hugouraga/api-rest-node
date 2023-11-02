import { FastifyInstance } from 'fastify'
import { register } from './controller/users/register'

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/user', register)
}
