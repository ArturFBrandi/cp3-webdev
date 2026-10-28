import { describe, expect, it } from 'vitest'
import { safeRedirect } from './redirect'

describe('safeRedirect', () => {
  it('keeps internal paths', () => {
    expect(safeRedirect('/dashboard/featured')).toBe('/dashboard/featured')
  })

  it.each([null, '', 'https://evil.com', '//evil.com', '/\\evil.com', 'dashboard'])(
    'falls back for %j',
    (target) => {
      expect(safeRedirect(target)).toBe('/dashboard')
    },
  )
})
