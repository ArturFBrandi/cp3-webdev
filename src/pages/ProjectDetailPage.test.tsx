import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchFeaturedNames } from '@/services/featured'
import { fetchReadme, fetchRepo, fetchRepos } from '@/services/github'
import { makeRepo } from '@/test/fixtures'
import { renderRoute } from '@/test/renderRoute'
import { NotFoundError } from '@/types/errors'

vi.mock(import('@/services/github'), async (importOriginal) => ({
  ...(await importOriginal()),
  fetchRepos: vi.fn<typeof fetchRepos>(),
  fetchRepo: vi.fn<typeof fetchRepo>(),
  fetchReadme: vi.fn<typeof fetchReadme>(),
}))
// The real renderer (react-markdown) is covered in ReadmeViewer.test.tsx.
vi.mock(import('@/components/projects/ReadmeViewer'), () => ({
  ReadmeViewer: ({ markdown }: { markdown: string }) => <div data-testid="readme">{markdown}</div>,
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

describe('project detail', () => {
  it('opens from a card without new GitHub requests, and back again', async () => {
    const { router } = renderRoute('/projects')
    await userEvent.click(await screen.findByRole('link', { name: 'smartlar-manager' }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'smartlar-manager' }),
    ).toBeInTheDocument()
    expect(await screen.findByTestId('readme')).toHaveTextContent('Readme body')

    await router.navigate('/projects')
    await screen.findByRole('link', { name: 'RetroPalette' })

    expect(fetchRepos).toHaveBeenCalledTimes(1)
    expect(fetchRepo).not.toHaveBeenCalled()
  })

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
