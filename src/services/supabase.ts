import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let clientPromise: Promise<SupabaseClient<Database>> | null = null

/**
 * The Supabase client, created on first use. supabase-js is imported dynamically so it stays
 * out of the initial bundle: the home page only needs it after first paint (featured list).
 */
export function getSupabase(): Promise<SupabaseClient<Database>> {
  if (!url || !anonKey) {
    return Promise.reject(
      new Error('Supabase is not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'),
    )
  }
  clientPromise ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient<Database>(url, anonKey),
  )
  return clientPromise
}
