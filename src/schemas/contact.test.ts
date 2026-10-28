import { describe, expect, it } from 'vitest'
import en from '@/locales/en.json'
import { contactSchema } from './contact'

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'I would like to talk about a project.',
}

function firstError(input: Record<string, unknown>, field: string) {
  const result = contactSchema.safeParse(input)
  return result.success
    ? undefined
    : result.error.issues.find((issue) => issue.path[0] === field)?.message
}

describe('contactSchema', () => {
  it('accepts a valid message and trims whitespace', () => {
    const result = contactSchema.parse({ ...valid, name: '  Ada  ' })
    expect(result.name).toBe('Ada')
  })

  it.each([
    ['name', '', 'contact.errors.nameRequired'],
    ['name', 'A', 'contact.errors.nameMin'],
    ['name', 'A'.repeat(101), 'contact.errors.nameMax'],
    ['email', '', 'contact.errors.emailRequired'],
    ['email', 'not-an-email', 'contact.errors.emailInvalid'],
    ['message', '   ', 'contact.errors.messageRequired'],
    ['message', 'too short', 'contact.errors.messageMin'],
    ['message', 'x'.repeat(2001), 'contact.errors.messageMax'],
  ])('rejects %s = %j with %s', (field, value, key) => {
    expect(firstError({ ...valid, [field]: value }, field)).toBe(key)
  })

  it('only uses error keys that exist in the locales', () => {
    const keys = Object.keys(en.contact.errors).map((key) => `contact.errors.${key}`)
    const result = contactSchema.safeParse({ name: '', email: 'x', message: '' })
    expect(result.success).toBe(false)
    for (const issue of result.error?.issues ?? []) expect(keys).toContain(issue.message)
  })
})
