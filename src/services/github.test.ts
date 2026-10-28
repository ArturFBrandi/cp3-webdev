import { describe, expect, it, vi } from 'vitest'
import { makeRepoResponse } from '@/test/fixtures'
import { NotFoundError, RateLimitError } from '@/types/errors'
import { fetchReadme, fetchRepos, filterPortfolioRepos, toRepo } from './github'

function mockFetch(response: Response) {
  const fetchMock = vi.fn<typeof fetch>(() => Promise.resolve(response))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('filterPortfolioRepos', () => {
  it('drops forks, archived, empty and profile repositories', () => {
    const repos = [
      makeRepoResponse({ name: 'keep' }),
      makeRepoResponse({ name: 'fork', fork: true }),
      makeRepoResponse({ name: 'old', archived: true }),
      makeRepoResponse({ name: 'empty', size: 0 }),
      makeRepoResponse({ name: 'ArturFBrandi' }),
    ]
    expect(filterPortfolioRepos(repos, 'arturfbrandi').map((repo) => repo.name)).toEqual(['keep'])
  })
})

describe('toRepo', () => {
  it('maps the API shape and normalizes empty values', () => {
    const repo = toRepo(makeRepoResponse({ homepage: '', topics: undefined, stargazers_count: 3 }))
    expect(repo).toMatchObject({ homepage: null, topics: [], stars: 3, defaultBranch: 'main' })
  })
})

describe('fetchRepos', () => {
  it('returns filtered repos, most recently pushed first', async () => {
    const fetchMock = mockFetch(
      Response.json([
        makeRepoResponse({ name: 'older', pushed_at: '2025-01-01T00:00:00Z' }),
        makeRepoResponse({ name: 'newer', pushed_at: '2026-01-01T00:00:00Z' }),
        makeRepoResponse({ name: 'forked', fork: true }),
      ]),
    )
    const repos = await fetchRepos()
    expect(repos.map((repo) => repo.name)).toEqual(['newer', 'older'])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('throws RateLimitError with the reset time when the limit is reached', async () => {
    mockFetch(
      new Response('{}', {
        status: 403,
        headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': '1800000000' },
      }),
    )
    const error = await fetchRepos().catch((caught: unknown) => caught)
    expect(error).toBeInstanceOf(RateLimitError)
    expect((error as RateLimitError).resetAt.getTime()).toBe(1_800_000_000_000)
  })

  it('throws a generic error for other failures', async () => {
    mockFetch(new Response('oops', { status: 500 }))
    await expect(fetchRepos()).rejects.toThrow('GitHub API request failed (500)')
  })
})

describe('fetchReadme', () => {
  it('returns null when the repository has no README', async () => {
    mockFetch(new Response('', { status: 404 }))
    await expect(fetchReadme('no-readme')).resolves.toBeNull()
  })

  it('still reports rate limits', async () => {
    mockFetch(new Response('', { status: 429, headers: { 'x-ratelimit-remaining': '0' } }))
    await expect(fetchReadme('x')).rejects.toBeInstanceOf(RateLimitError)
  })

  it('maps a missing repository to NotFoundError elsewhere', () => {
    expect(new NotFoundError()).toBeInstanceOf(Error)
  })
})
