import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchFeaturedNames } from './featured'
import { getSupabase } from './supabase'

vi.mock(import('./supabase'), () => ({ getSupabase: vi.fn<typeof getSupabase>() }))

function mockQuery(result: { data: unknown; error: unknown }) {
  const order = vi.fn<(column: string, options: unknown) => Promise<typeof result>>(() =>
    Promise.resolve(result),
  )
  const select = vi.fn<(columns: string) => { order: typeof order }>(() => ({ order }))
  const from = vi.fn<(table: string) => { select: typeof select }>(() => ({ select }))
  vi.mocked(getSupabase).mockResolvedValue({ from } as unknown as Awaited<
    ReturnType<typeof getSupabase>
  >)
  return { from, select, order }
}

describe('fetchFeaturedNames', () => {
  beforeEach(() => vi.mocked(getSupabase).mockReset())

  it('reads featured_projects ordered by position and returns the names', async () => {
    const { from, order } = mockQuery({
      data: [{ repo_name: 'ai-hardcore-engineer' }, { repo_name: 'smartlar-manager' }],
      error: null,
    })
    await expect(fetchFeaturedNames()).resolves.toEqual([
      'ai-hardcore-engineer',
      'smartlar-manager',
    ])
    expect(from).toHaveBeenCalledWith('featured_projects')
    expect(order).toHaveBeenCalledWith('position', { ascending: true })
  })

  it('throws when Supabase returns an error', async () => {
    mockQuery({ data: null, error: { message: 'permission denied' } })
    await expect(fetchFeaturedNames()).rejects.toThrow('permission denied')
  })
})
