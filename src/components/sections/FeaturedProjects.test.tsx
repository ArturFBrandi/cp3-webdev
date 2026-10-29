import { screen, within } from '@testing-library/react'
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
