export class UserAlreadyExistError extends Error {
  constructor() {
    super('user already exists')
  }
}
