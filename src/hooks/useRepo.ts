import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchRepo } from '@/services/github'
import type { Repo } from '@/types/github'
import { queryKeys } from './queryKeys'

/** One repository. Reuses the cached list when available, so navigating from a card costs no request. */
export function useRepo(name: string) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: queryKeys.repo(name),
    queryFn: () => fetchRepo(name),
    initialData: () =>
      queryClient.getQueryData<Repo[]>(queryKeys.repos)?.find((repo) => repo.name === name),
    initialDataUpdatedAt: () => queryClient.getQueryState(queryKeys.repos)?.dataUpdatedAt,
  })
}
