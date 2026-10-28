import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('renders the owner name', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Artur Brandi' })).toBeInTheDocument()
  })
})
