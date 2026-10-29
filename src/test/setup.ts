import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { i18n } from '@/app/i18n'

beforeEach(async () => {
  // No real network in tests: anything not explicitly mocked fails fast.
  vi.stubGlobal(
    'fetch',
    vi.fn<typeof fetch>(() => Promise.reject(new Error('Network is disabled in tests'))),
  )
  await i18n.changeLanguage('en')
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.unstubAllGlobals()
})
