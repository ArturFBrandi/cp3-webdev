import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchFeaturedNames } from '@/services/featured'
import { fetchReadme, fetchRepo, fetchRepos } from '@/services/github'
import { makeRepo } from '@/test/fixtures'
import { renderRoute } from '@/test/renderRoute'

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
  makeRepo({ name: 'ai-hardcore-engineer-v2', language: 'Python', description: null }),
  makeRepo({ name: 'smartlar-manager', homepage: 'https://smartlar-manager.lovable.app/' }),
  makeRepo({ name: 'aseprite-compiler' }),
  makeRepo({ name: 'RetroPalette', language: 'C#' }),
  makeRepo({ name: 'CS107', language: 'C' }),
]

beforeEach(() => {
  vi.mocked(fetchRepos).mockReset().mockResolvedValue(repos)
  vi.mocked(fetchRepo).mockReset()
  vi.mocked(fetchReadme).mockReset().mockResolvedValue('# Hello\n\nReadme body')
  vi.mocked(fetchFeaturedNames)
    .mockReset()
    .mockResolvedValue(['ai-hardcore-engineer-v2', 'smartlar-manager', 'aseprite-compiler'])
})

describe('home featured projects', () => {
  it('shows the featured repositories in the chosen order, the first as the main focus', async () => {
    renderRoute('/')
    const section = await screen.findByRole('region', { name: 'Selected work' })
    const titles = await within(section).findAllByRole('heading', { level: 3 })
    expect(titles.map((title) => title.textContent)).toEqual([
      'ai-hardcore-engineer-v2',
      'smartlar-manager',
      'aseprite-compiler',
    ])
    const [first] = within(section).getAllByRole('listitem')
    expect(within(first!).getByText('Main focus')).toBeInTheDocument()
    expect(within(section).getAllByText('Main focus')).toHaveLength(1)
  })

  it('reveals the other portfolio repositories when expanded', async () => {
    const user = userEvent.setup()
    renderRoute('/')
    const section = await screen.findByRole('region', { name: 'Selected work' })
    const toggle = await within(section).findByRole('button', { name: 'Show 2 more projects' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(within(section).queryByRole('heading', { name: 'RetroPalette' })).not.toBeInTheDocument()

    await user.click(toggle)
    expect(within(section).getByRole('heading', { name: 'RetroPalette' })).toBeVisible()
    expect(within(section).getByRole('heading', { name: 'CS107' })).toBeVisible()

    await user.click(within(section).getByRole('button', { name: 'Show fewer projects' }))
    expect(within(section).queryByRole('heading', { name: 'RetroPalette' })).not.toBeInTheDocument()
  })

  it('falls back to recent repositories when the featured list fails', async () => {
    vi.mocked(fetchFeaturedNames).mockRejectedValue(new Error('supabase down'))
    renderRoute('/')
    const section = await screen.findByRole('region', { name: 'Selected work' })
    expect(await within(section).findAllByRole('heading', { level: 3 })).toHaveLength(3)
    expect(within(section).queryByRole('alert')).not.toBeInTheDocument()
  })
})
