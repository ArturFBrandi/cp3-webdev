import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { i18n } from '@/app/i18n'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders the ported content in english', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Artur Brandi' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'What I work with' })).toBeInTheDocument()
    expect(screen.getByText('Feb 2023 — Present')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Farmoria' })).toBeInTheDocument()
  })

  it('renders the portuguese content after switching language', async () => {
    render(<HomePage />)
    await act(() => i18n.changeLanguage('pt'))
    expect(screen.getByText('Engenheiro de Software Backend')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Com o que eu trabalho' })).toBeInTheDocument()
    expect(screen.getByText('fev de 2023 — Atual')).toBeInTheDocument()
  })
})
