import { describe, expect, it, vi } from 'vitest'
import { makeRepoResponse } from '@/test/fixtures'
import { NotFoundError, RateLimitError } from '@/types/errors'
import { fetchReadme, fetchRepo, fetchRepos, selectPortfolioRepos, toRepo } from './github'

function mockFetch(response: Response) {
  const fetchMock = vi.fn<typeof fetch>(() => Promise.resolve(response))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('selectPortfolioRepos', () => {
  it('keeps only listed repositories, in the list order, matching names case-insensitively', () => {
    const repos = [
      makeRepoResponse({ name: 'hidden' }),
      makeRepoResponse({ name: 'second' }),
      makeRepoResponse({ name: 'First' }),
    ]
    expect(
      selectPortfolioRepos(repos, ['first', 'second', 'missing']).map((repo) => repo.name),
    ).toEqual(['First', 'second'])
  })
})

describe('toRepo', () => {
  it('maps the API shape and normalizes empty values', () => {
    const repo = toRepo(makeRepoResponse({ homepage: '', topics: undefined, stargazers_count: 3 }))
    expect(repo).toMatchObject({ homepage: null, topics: [], stars: 3, defaultBranch: 'main' })
  })
})

describe('fetchRepos', () => {
  it('returns only portfolio repos, in the portfolio order', async () => {
    const fetchMock = mockFetch(
      Response.json([
        makeRepoResponse({ name: 'CS106A' }),
        makeRepoResponse({ name: 'some-other-repo' }),
        makeRepoResponse({ name: 'ai-hardcore-engineer-v2' }),
      ]),
    )
    const repos = await fetchRepos()
    expect(repos.map((repo) => repo.name)).toEqual(['ai-hardcore-engineer-v2', 'CS106A'])
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
})

describe('fetchRepo', () => {
  it('requests the repository and maps it', async () => {
    const fetchMock = mockFetch(
      Response.json(makeRepoResponse({ name: 'smartlar-manager', stargazers_count: 2 })),
    )
    await expect(fetchRepo('smartlar-manager')).resolves.toMatchObject({
      name: 'smartlar-manager',
      stars: 2,
    })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/repos/ArturFBrandi/smartlar-manager',
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: 'application/vnd.github+json' }),
      }),
    )
  })

  it('throws NotFoundError for a missing repository', async () => {
    mockFetch(new Response('', { status: 404 }))
    await expect(fetchRepo('CS107')).rejects.toBeInstanceOf(NotFoundError)
  })

  it('treats repositories outside the portfolio as not found, without a request', async () => {
    const fetchMock = mockFetch(Response.json(makeRepoResponse({ name: 'some-other-repo' })))
    await expect(fetchRepo('some-other-repo')).rejects.toBeInstanceOf(NotFoundError)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
