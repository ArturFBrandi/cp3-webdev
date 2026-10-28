import { describe, expect, it } from 'vitest'
import { formatMonth, formatRelative } from './format'

describe('formatMonth', () => {
  it('formats an ISO month in english', () => {
    expect(formatMonth('2023-02', 'en-US')).toBe('Feb 2023')
  })

  it('formats an ISO month in portuguese', () => {
    expect(formatMonth('2023-02', 'pt-BR')).toBe('fev de 2023')
  })

  it('returns the input when it is not an ISO month', () => {
    expect(formatMonth('soon', 'en-US')).toBe('soon')
  })
})

describe('formatRelative', () => {
  const now = Date.parse('2026-10-28T12:00:00Z')

  it('uses the largest fitting unit', () => {
    expect(formatRelative('2026-10-25T12:00:00Z', 'en-US', now)).toBe('3 days ago')
    expect(formatRelative('2026-08-28T12:00:00Z', 'en-US', now)).toBe('2 months ago')
  })

  it('says "yesterday" and handles portuguese', () => {
    expect(formatRelative('2026-10-27T12:00:00Z', 'en-US', now)).toBe('yesterday')
    expect(formatRelative('2026-10-25T12:00:00Z', 'pt-BR', now)).toBe('há 3 dias')
  })

  it('falls back to "now" for recent dates', () => {
    expect(formatRelative('2026-10-28T11:59:30Z', 'en-US', now)).toBe('this minute')
  })
})
