import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '@/test/renderRoute'

describe('routes', () => {
  it('renders the home page at /', async () => {
    renderRoute('/')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Artur Brandi' }),
    ).toBeInTheDocument()
  })

  it('opens a project URL directly', async () => {
    renderRoute('/projects/smartlar-manager')
    expect(await screen.findByRole('heading', { name: 'smartlar-manager' })).toBeInTheDocument()
  })

  it('shows a friendly 404 inside the layout for unknown routes', async () => {
    renderRoute('/does-not-exist')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(document.title).toBe('Page not found — Artur Brandi')
  })

  it('navigates client-side from the 404 back home', async () => {
    const { router } = renderRoute('/nope')
    await userEvent.click(await screen.findByRole('link', { name: 'Back to home' }))
    expect(router.state.location.pathname).toBe('/')
  })

  it('marks the projects nav link as current', async () => {
    renderRoute('/projects')
    expect(await screen.findByRole('link', { name: 'Projects' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})
