import { describe, expect, it } from 'vitest'
import { makeRepo } from '@/test/fixtures'
import { resolveReadmeUrl } from './readmeUrl'

const repo = makeRepo({ name: 'demo', defaultBranch: 'main' })

describe('resolveReadmeUrl', () => {
  it('points relative images at raw.githubusercontent.com', () => {
    expect(resolveReadmeUrl('./docs/shot.png', 'src', repo)).toBe(
      'https://raw.githubusercontent.com/ArturFBrandi/demo/main/docs/shot.png',
    )
  })

  it('points relative links at the file on github.com', () => {
    expect(resolveReadmeUrl('database/schema.sql', 'href', repo)).toBe(
      'https://github.com/ArturFBrandi/demo/blob/main/database/schema.sql',
    )
  })

  it('keeps absolute URLs and anchors, and blocks javascript: links', () => {
    expect(resolveReadmeUrl('https://example.com', 'href', repo)).toBe('https://example.com')
    expect(resolveReadmeUrl('#setup', 'href', repo)).toBe('#setup')
    expect(resolveReadmeUrl('javascript:alert(1)', 'href', repo)).toBe('')
  })
})
