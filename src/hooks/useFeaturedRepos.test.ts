import { describe, expect, it } from 'vitest'
import { makeRepo } from '@/test/fixtures'
import { FEATURED_FALLBACK_COUNT, selectFeatured } from './useFeaturedRepos'

const repos = ['a', 'b', 'c', 'd'].map((name) => makeRepo({ name }))

describe('selectFeatured', () => {
  it('keeps the featured order and skips names that no longer exist', () => {
    expect(selectFeatured(repos, ['c', 'gone', 'a']).map((repo) => repo.name)).toEqual(['c', 'a'])
  })

  it('falls back to the most recent repos when nothing is featured', () => {
    expect(selectFeatured(repos, [])).toHaveLength(FEATURED_FALLBACK_COUNT)
    expect(selectFeatured(repos, undefined)[0]?.name).toBe('a')
  })
})
