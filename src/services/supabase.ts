import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const client: SupabaseClient<Database> | null =
  url && anonKey ? createClient<Database>(url, anonKey) : null

export function getSupabase(): SupabaseClient<Database> {
  if (!client) {
    throw new Error('Supabase is not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  }
  return client
}
