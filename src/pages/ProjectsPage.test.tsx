import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchFeaturedNames } from '@/services/featured'
import { fetchReadme, fetchRepo, fetchRepos } from '@/services/github'
import { makeRepo } from '@/test/fixtures'
import { renderRoute } from '@/test/renderRoute'
import { RateLimitError } from '@/types/errors'

vi.mock(import('@/services/github'), async (importOriginal) => ({
  ...(await importOriginal()),
  fetchRepos: vi.fn<typeof fetchRepos>(),
  fetchRepo: vi.fn<typeof fetchRepo>(),
  fetchReadme: vi.fn<typeof fetchReadme>(),
}))
vi.mock(import('@/services/featured'), () => ({
  fetchFeaturedNames: vi.fn<typeof fetchFeaturedNames>(),
}))

const repos = [
  makeRepo({ name: 'smartlar-manager', homepage: 'https://smartlar-manager.lovable.app/' }),
  makeRepo({ name: 'ai-hardcore-engineer', language: 'Python', description: null }),
  makeRepo({ name: 'RetroPalette', language: 'C#' }),
]

beforeEach(() => {
  vi.mocked(fetchRepos).mockReset().mockResolvedValue(repos)
  vi.mocked(fetchRepo).mockReset()
  vi.mocked(fetchReadme).mockReset().mockResolvedValue('# Hello\n\nReadme body')
  vi.mocked(fetchFeaturedNames)
    .mockReset()
    .mockResolvedValue(['ai-hardcore-engineer', 'smartlar-manager'])
})

describe('projects page', () => {
  it('shows skeletons while loading, then one card per repository', async () => {
    let resolve: (value: typeof repos) => void = () => {}
    vi.mocked(fetchRepos).mockReturnValue(new Promise((r) => (resolve = r)))
    renderRoute('/projects')

    expect(await screen.findByText('Loading projects…')).toBeInTheDocument()
    resolve(repos)

    expect(await screen.findAllByRole('heading', { level: 3 })).toHaveLength(3)
    expect(screen.getByRole('link', { name: 'smartlar-manager' })).toHaveAttribute(
      'href',
      '/projects/smartlar-manager',
    )
    expect(screen.getByText('No description yet.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Website' })).toHaveAttribute(
      'href',
      'https://smartlar-manager.lovable.app/',
    )
  })

  it('explains a GitHub rate limit and retries on demand', async () => {
    vi.mocked(fetchRepos).mockRejectedValue(new RateLimitError(new Date('2026-10-28T15:30:00')))
    renderRoute('/projects')

    expect(await screen.findByRole('alert')).toHaveTextContent(/request limit .* resets at 3:30/)
    vi.mocked(fetchRepos).mockResolvedValue(repos)
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByRole('link', { name: 'RetroPalette' })).toBeInTheDocument()
  })

  it('shows an empty state when there are no repositories', async () => {
    vi.mocked(fetchRepos).mockResolvedValue([])
    renderRoute('/projects')
    expect(await screen.findByRole('heading', { name: 'No projects yet' })).toBeInTheDocument()
  })
})
