/** Thrown when a requested resource doesn't exist; route boundaries render the 404 page for it. */
export class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}
