/** Thrown when a requested resource doesn't exist; route boundaries render the 404 page for it. */
export class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

/** GitHub's unauthenticated limit (60 requests/hour per IP) was reached. */
export class RateLimitError extends Error {
  readonly resetAt: Date

  constructor(resetAt: Date) {
    super(`GitHub API rate limit reached until ${resetAt.toISOString()}`)
    this.name = 'RateLimitError'
    this.resetAt = resetAt
  }
}
