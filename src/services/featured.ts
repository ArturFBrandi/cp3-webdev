import { getSupabase } from './supabase'

/** Repository names featured on the home page, in display order. */
export async function fetchFeaturedNames(): Promise<string[]> {
  const { data, error } = await getSupabase()
    .from('featured_projects')
    .select('repo_name')
    .order('position', { ascending: true })

  if (error) throw new Error(`Could not load featured projects: ${error.message}`)
  return data.map((row) => row.repo_name)
}
