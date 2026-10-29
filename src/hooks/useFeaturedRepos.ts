import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchFeaturedNames } from '@/services/featured'
import type { Repo } from '@/types/github'
import { queryKeys } from './queryKeys'
import { useRepos } from './useRepos'

/** How many repos (first on the portfolio list) to show when nothing is featured or the list fails. */
export const FEATURED_FALLBACK_COUNT = 3

export function useFeaturedNames() {
  return useQuery({
    queryKey: queryKeys.featured,
    queryFn: fetchFeaturedNames,
    staleTime: 60 * 1000,
  })
}

export function selectFeatured(repos: Repo[], featuredNames: string[] | undefined): Repo[] {
  const byName = new Map(repos.map((repo) => [repo.name, repo]))
  const featured = (featuredNames ?? []).flatMap((name) => byName.get(name) ?? [])
  return featured.length > 0 ? featured : repos.slice(0, FEATURED_FALLBACK_COUNT)
}

/**
 * Featured repositories for the home page, plus the remaining portfolio repos (`others`) for the
 * expandable list. The GitHub list drives the loading and error states; if the featured list
 * (Supabase) fails, the first portfolio repos are shown instead of an error.
 */
export function useFeaturedRepos() {
  const repos = useRepos()
  const featured = useFeaturedNames()
  const featuredSettled = featured.isSuccess || featured.isError

  const data = useMemo(
    () => (repos.data && featuredSettled ? selectFeatured(repos.data, featured.data) : undefined),
    [repos.data, featured.data, featuredSettled],
  )
  const others = useMemo(
    () => (repos.data && data ? repos.data.filter((repo) => !data.includes(repo)) : []),
    [repos.data, data],
  )

  return {
    data,
    others,
    isPending: repos.isPending || !featuredSettled,
    error: repos.error,
    refetch: repos.refetch,
  }
}
