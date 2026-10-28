import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppProviders } from './AppProviders'
import { App } from './App'

describe('App', () => {
  it('boots the browser router on the home page', async () => {
    render(
      <AppProviders>
        <App />
      </AppProviders>,
    )
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Artur Brandi' }),
    ).toBeInTheDocument()
  })
})
