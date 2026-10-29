import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LanguageSwitcher } from './LanguageSwitcher'

describe('LanguageSwitcher', () => {
  it('switches to portuguese and marks it as selected', async () => {
    render(<LanguageSwitcher />)

    expect(screen.getByRole('button', { name: 'Switch language to English' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    await userEvent.click(screen.getByRole('button', { name: 'Switch language to Português' }))

    expect(screen.getByRole('group', { name: 'Idioma' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mudar idioma para Português' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(localStorage.getItem('lang')).toBe('pt')
  })
})
