import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getSession, onSessionChange, signIn, signOut, type Session } from '@/services/auth'
import { fetchMessages, type setMessageAnswered } from '@/services/messages'
import { renderRoute } from '@/test/renderRoute'

vi.mock(import('@/services/auth'), async (importOriginal) => ({
  ...(await importOriginal()),
  getSession: vi.fn<typeof getSession>(),
  onSessionChange: vi.fn<typeof onSessionChange>(),
  signIn: vi.fn<typeof signIn>(),
  signOut: vi.fn<typeof signOut>(),
}))
vi.mock(import('@/services/messages'), () => ({
  fetchMessages: vi.fn<typeof fetchMessages>(),
  setMessageAnswered: vi.fn<typeof setMessageAnswered>(),
}))

// Lazy route chunks can take a while to import on the first run.
vi.setConfig({ testTimeout: 30_000 })
const slow = { timeout: 15_000 }

const sessionFor = (email: string) => ({ user: { email } }) as Session

beforeEach(() => {
  vi.mocked(getSession).mockReset().mockResolvedValue(null)
  vi.mocked(onSessionChange)
    .mockReset()
    .mockReturnValue(() => {})
  vi.mocked(signIn).mockReset()
  vi.mocked(signOut).mockReset().mockResolvedValue()
  vi.mocked(fetchMessages).mockReset().mockResolvedValue([])
})

describe('dashboard protection', () => {
  it('redirects a visitor without a session to the login page', async () => {
    const { router } = renderRoute('/dashboard')

    expect(await screen.findByRole('heading', { name: 'Owner login' }, slow)).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/login')
    expect(router.state.location.search).toBe('?redirect=%2Fdashboard')
    expect(screen.queryByRole('heading', { name: 'Dashboard' })).not.toBeInTheDocument()
    expect(fetchMessages).not.toHaveBeenCalled()
  })

  it('keeps the requested dashboard page in the redirect', async () => {
    const { router } = renderRoute('/dashboard/featured')
    await screen.findByRole('heading', { name: 'Owner login' }, slow)
    expect(router.state.location.search).toBe('?redirect=%2Fdashboard%2Ffeatured')
  })

  it('lets the signed-in owner in', async () => {
    vi.mocked(getSession).mockResolvedValue(sessionFor('arturbrandi5@gmail.com'))
    const { router } = renderRoute('/dashboard')

    expect(await screen.findByRole('heading', { name: 'Dashboard' }, slow)).toBeInTheDocument()
    expect(
      await screen.findByRole('heading', { name: 'No messages yet' }, slow),
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/dashboard/messages')
  })

  it('denies a signed-in user who is not the owner', async () => {
    vi.mocked(getSession).mockResolvedValue(sessionFor('someone@example.com'))
    renderRoute('/dashboard')

    expect(await screen.findByRole('heading', { name: 'Access denied' }, slow)).toBeInTheDocument()
    expect(fetchMessages).not.toHaveBeenCalled()
  })
})

describe('login', () => {
  it('signs in and returns to the requested page', async () => {
    vi.mocked(signIn).mockResolvedValue(sessionFor('arturbrandi5@gmail.com'))
    const user = userEvent.setup()
    const { router } = renderRoute('/login?redirect=%2Fdashboard%2Fmessages')

    await user.type(await screen.findByLabelText('E-mail', {}, slow), 'arturbrandi5@gmail.com')
    await user.type(screen.getByLabelText('Password'), 'secret')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByRole('heading', { name: 'Dashboard' }, slow)).toBeInTheDocument()
    expect(signIn).toHaveBeenCalledWith('arturbrandi5@gmail.com', 'secret')
    expect(router.state.location.pathname).toBe('/dashboard/messages')
  })

  it('shows an error for wrong credentials', async () => {
    const { InvalidCredentialsError } = await import('@/services/auth')
    vi.mocked(signIn).mockRejectedValue(new InvalidCredentialsError())
    const user = userEvent.setup()
    renderRoute('/login')

    await user.type(await screen.findByLabelText('E-mail', {}, slow), 'arturbrandi5@gmail.com')
    await user.type(screen.getByLabelText('Password'), 'wrong')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid e-mail or password.')
  })

  it('validates the fields before calling the server', async () => {
    const user = userEvent.setup()
    renderRoute('/login')
    await user.click(await screen.findByRole('button', { name: 'Sign in' }, slow))

    expect(await screen.findByText('Enter your e-mail')).toBeInTheDocument()
    expect(screen.getByText('Enter your password')).toBeInTheDocument()
    expect(signIn).not.toHaveBeenCalled()
  })
})
