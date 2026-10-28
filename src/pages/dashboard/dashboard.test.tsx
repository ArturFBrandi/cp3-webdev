import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getSession, onSessionChange, type Session } from '@/services/auth'
import { fetchFeaturedNames, saveFeaturedNames } from '@/services/featured'
import { fetchRepos } from '@/services/github'
import { fetchMessages, setMessageAnswered } from '@/services/messages'
import { makeRepo } from '@/test/fixtures'
import { renderRoute } from '@/test/renderRoute'
import type { Message } from '@/types/messages'

vi.mock(import('@/services/auth'), async (importOriginal) => ({
  ...(await importOriginal()),
  getSession: vi.fn<typeof getSession>(),
  onSessionChange: vi.fn<typeof onSessionChange>(),
}))
vi.mock(import('@/services/messages'), () => ({
  fetchMessages: vi.fn<typeof fetchMessages>(),
  setMessageAnswered: vi.fn<typeof setMessageAnswered>(),
}))
vi.mock(import('@/services/featured'), () => ({
  fetchFeaturedNames: vi.fn<typeof fetchFeaturedNames>(),
  saveFeaturedNames: vi.fn<typeof saveFeaturedNames>(),
}))
vi.mock(import('@/services/github'), async (importOriginal) => ({
  ...(await importOriginal()),
  fetchRepos: vi.fn<typeof fetchRepos>(),
}))

vi.setConfig({ testTimeout: 30_000 })
const slow = { timeout: 15_000 }

const messages: Message[] = [
  {
    id: 'm1',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    message: 'I would like to talk about a project.',
    answered: false,
    answeredAt: null,
    createdAt: '2026-10-27T13:00:00Z',
  },
  {
    id: 'm2',
    name: 'Alan Turing',
    email: 'alan@example.com',
    message: 'Thanks for answering my question last week!',
    answered: true,
    answeredAt: '2026-10-20T10:00:00Z',
    createdAt: '2026-10-19T09:00:00Z',
  },
]

beforeEach(() => {
  vi.mocked(getSession)
    .mockReset()
    .mockResolvedValue({ user: { email: 'arturbrandi5@gmail.com' } } as Session)
  vi.mocked(onSessionChange)
    .mockReset()
    .mockReturnValue(() => {})
  // Behaves like the database: updates are visible to the next fetch.
  let stored = messages.map((message) => ({ ...message }))
  vi.mocked(fetchMessages)
    .mockReset()
    .mockImplementation(() => Promise.resolve(stored))
  vi.mocked(setMessageAnswered)
    .mockReset()
    .mockImplementation((id, answered) => {
      stored = stored.map((message) => (message.id === id ? { ...message, answered } : message))
      return Promise.resolve()
    })
  vi.mocked(fetchFeaturedNames).mockReset().mockResolvedValue(['smartlar-manager'])
  vi.mocked(saveFeaturedNames).mockReset().mockResolvedValue()
  vi.mocked(fetchRepos)
    .mockReset()
    .mockResolvedValue(
      ['smartlar-manager', 'ai-hardcore-engineer', 'RetroPalette'].map((name) =>
        makeRepo({ name }),
      ),
    )
})

describe('messages page', () => {
  it('lists messages with their status and marks one as answered', async () => {
    const user = userEvent.setup()
    renderRoute('/dashboard/messages')

    expect(await screen.findByText('1 unanswered', {}, slow)).toBeInTheDocument()
    const ada = screen.getByRole('heading', { name: 'Ada Lovelace' }).closest('li')!
    expect(within(ada).getByText('Waiting for reply')).toBeInTheDocument()

    await user.click(within(ada).getByRole('button', { name: 'Mark as answered' }))

    expect(setMessageAnswered).toHaveBeenCalledWith('m1', true)
    expect(await within(ada).findByText('Answered')).toBeInTheDocument()
  })
})

describe('featured page', () => {
  it('saves the selection in the order it was picked', async () => {
    const user = userEvent.setup()
    renderRoute('/dashboard/featured')

    const smartlar = await screen.findByRole('checkbox', { name: /smartlar-manager/ }, slow)
    expect(smartlar).toBeChecked()
    const save = screen.getByRole('button', { name: 'Save selection' })
    expect(save).toBeDisabled()

    await user.click(screen.getByRole('checkbox', { name: /RetroPalette/ }))
    await user.click(screen.getByRole('checkbox', { name: /ai-hardcore-engineer/ }))
    await user.click(save)

    expect(saveFeaturedNames).toHaveBeenCalledWith([
      'smartlar-manager',
      'RetroPalette',
      'ai-hardcore-engineer',
    ])
    expect(await screen.findByText('Featured projects saved.')).toBeInTheDocument()
  })
})
