import { describe, expect, it, vi } from 'vitest'
import type { ContactMessage } from '../../src/schemas/contact.js'
import { handleContact, type ContactDeps } from './handleContact.js'

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'I would like to talk about a project.',
}

function post(body: unknown) {
  return new Request('https://example.com/api/contact', {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

function deps(overrides: Partial<ContactDeps> = {}) {
  return {
    saveMessage: vi.fn<(m: ContactMessage) => Promise<void>>(() => Promise.resolve()),
    sendEmail: vi.fn<(m: ContactMessage) => Promise<void>>(() => Promise.resolve()),
    ...overrides,
  }
}

describe('handleContact', () => {
  it('saves and emails a valid message', async () => {
    const d = deps()
    const response = await handleContact(post(valid), d)
    expect(response.status).toBe(200)
    expect(d.saveMessage).toHaveBeenCalledWith(expect.objectContaining(valid))
    expect(d.sendEmail).toHaveBeenCalledTimes(1)
  })

  it('rejects invalid input with per-field error keys and stores nothing', async () => {
    const d = deps()
    const response = await handleContact(post({ ...valid, email: 'nope', message: 'short' }), d)
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: 'validation',
      fields: { email: 'contact.errors.emailInvalid', message: 'contact.errors.messageMin' },
    })
    expect(d.saveMessage).not.toHaveBeenCalled()
  })

  it('rejects malformed JSON', async () => {
    const response = await handleContact(post('{oops'), deps())
    expect(response.status).toBe(400)
  })

  it('silently drops honeypot submissions', async () => {
    const d = deps()
    const response = await handleContact(post({ ...valid, website: 'spam.example' }), d)
    expect(response.status).toBe(200)
    expect(d.saveMessage).not.toHaveBeenCalled()
  })

  it('fails when the message cannot be stored', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const d = deps({
      saveMessage: vi.fn<ContactDeps['saveMessage']>(() => Promise.reject(new Error('db down'))),
    })
    const response = await handleContact(post(valid), d)
    expect(response.status).toBe(500)
    expect(d.sendEmail).not.toHaveBeenCalled()
  })

  it('still succeeds when only the email fails, since the message is stored', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const d = deps({
      sendEmail: vi.fn<ContactDeps['sendEmail']>(() => Promise.reject(new Error('resend down'))),
    })
    const response = await handleContact(post(valid), d)
    expect(response.status).toBe(200)
  })
})
