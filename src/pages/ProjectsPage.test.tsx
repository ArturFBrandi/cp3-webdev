import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchFeaturedNames } from '@/services/featured'
import { fetchReadme, fetchRepo, fetchRepos } from '@/services/github'
import { makeRepo } from '@/test/fixtures'
import { renderRoute } from '@/test/renderRoute'
import { NotFoundError, RateLimitError } from '@/types/errors'

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

describe('home featured projects', () => {
  it('shows the featured repositories in the chosen order', async () => {
    renderRoute('/')
    const section = await screen.findByRole('region', { name: 'Selected work' })
    const titles = await within(section).findAllByRole('heading', { level: 3 })
    expect(titles.map((title) => title.textContent)).toEqual([
      'ai-hardcore-engineer',
      'smartlar-manager',
    ])
  })

  it('falls back to recent repositories when the featured list fails', async () => {
    vi.mocked(fetchFeaturedNames).mockRejectedValue(new Error('supabase down'))
    renderRoute('/')
    const section = await screen.findByRole('region', { name: 'Selected work' })
    expect(await within(section).findAllByRole('heading', { level: 3 })).toHaveLength(3)
    expect(within(section).queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('project detail', () => {
  it('opens from a card without new GitHub requests, and back again', async () => {
    const { router } = renderRoute('/projects')
    await userEvent.click(await screen.findByRole('link', { name: 'smartlar-manager' }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'smartlar-manager' }),
    ).toBeInTheDocument()
    // The README renderer is a lazy chunk; importing it can be slow on the first test run.
    expect(
      await screen.findByRole('heading', { name: 'Hello' }, { timeout: 10_000 }),
    ).toBeInTheDocument()

    await router.navigate('/projects')
    await screen.findByRole('link', { name: 'RetroPalette' })

    expect(fetchRepos).toHaveBeenCalledTimes(1)
    expect(fetchRepo).not.toHaveBeenCalled()
  }, 30_000)

  it('loads a shared link directly', async () => {
    vi.mocked(fetchRepo).mockResolvedValue(repos[0]!)
    renderRoute('/projects/smartlar-manager')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'smartlar-manager' }),
    ).toBeInTheDocument()
    expect(fetchRepo).toHaveBeenCalledWith('smartlar-manager')
  })

  it('shows the 404 page for a repository that does not exist', async () => {
    vi.mocked(fetchRepo).mockRejectedValue(new NotFoundError())
    renderRoute('/projects/nope')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('says so when the repository has no README', async () => {
    vi.mocked(fetchRepo).mockResolvedValue(repos[2]!)
    vi.mocked(fetchReadme).mockResolvedValue(null)
    renderRoute('/projects/RetroPalette')
    expect(
      await screen.findByText("This repository doesn't have a README yet."),
    ).toBeInTheDocument()
  })
})
