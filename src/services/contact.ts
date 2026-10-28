import type { ContactInput } from '@/schemas/contact'

export class ContactRequestError extends Error {
  readonly status: number

  constructor(status: number) {
    super(`Contact request failed with status ${status}`)
    this.name = 'ContactRequestError'
    this.status = status
  }
}

/** Sends the contact form to the Vercel Function, which stores it and emails the owner. */
export async function sendContactMessage(input: ContactInput): Promise<void> {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) throw new ContactRequestError(response.status)
}
