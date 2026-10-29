import { describe, expect, it } from 'vitest'
import { formatMonth } from './format'

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
