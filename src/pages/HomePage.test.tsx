import { act, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { i18n } from '@/app/i18n'
import { renderRoute } from '@/test/renderRoute'

describe('HomePage', () => {
  it('renders the ported content in english', async () => {
    renderRoute('/')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Artur Brandi' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'What I work with' })).toBeInTheDocument()
    expect(screen.getByText('Feb 2023 — Present')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Farmoria' })).toBeInTheDocument()
  })

  it('renders the portuguese content after switching language', async () => {
    renderRoute('/')
    await screen.findByRole('heading', { level: 1, name: 'Artur Brandi' })
    await act(() => i18n.changeLanguage('pt'))
    expect(screen.getByText('Engenheiro de Software Backend')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Com o que eu trabalho' })).toBeInTheDocument()
    expect(screen.getByText('fev de 2023 — Atual')).toBeInTheDocument()
    expect(document.title).toBe('Artur Brandi — Engenheiro de Software e IA')
  })
})
