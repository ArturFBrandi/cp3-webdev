import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { i18n } from '@/app/i18n'
import { useContent } from './useContent'
import { useLanguage } from './useLanguage'

describe('useContent', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('returns content for the current language and follows changes', async () => {
    const { result } = renderHook(() => ({ content: useContent(), lang: useLanguage() }))
    expect(result.current.content.profile.role).toBe('Backend Software Engineer')

    await act(() => result.current.lang.setLanguage('pt'))

    expect(result.current.content.profile.role).toBe('Engenheiro de Software Backend')
    expect(result.current.lang.locale).toBe('pt-BR')
    expect(document.documentElement.lang).toBe('pt-BR')
    expect(localStorage.getItem('lang')).toBe('pt')
  })
})
