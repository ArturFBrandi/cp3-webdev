import { describe, expect, it } from 'vitest'
import en from './en.json'
import pt from './pt.json'

function keysOf(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix]
  return Object.entries(value).flatMap(([key, child]) =>
    keysOf(child, prefix ? `${prefix}.${key}` : key),
  )
}

describe('locales', () => {
  it('pt.json has exactly the same keys as en.json', () => {
    expect(keysOf(pt).sort()).toEqual(keysOf(en).sort())
  })

  it('has no empty strings', () => {
    for (const [name, dict] of Object.entries({ en, pt })) {
      const empty = keysOf(dict).filter(
        (key) => key.split('.').reduce<unknown>((obj, k) => (obj as never)[k], dict) === '',
      )
      expect(empty, `empty keys in ${name}.json`).toEqual([])
    }
  })
})
