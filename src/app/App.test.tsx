import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/renderWithProviders'
import { App } from './App'

describe('App', () => {
  it('renders the owner name', () => {
    renderWithProviders(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'Artur Brandi' })).toBeInTheDocument()
  })
})
