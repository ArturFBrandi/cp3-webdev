import { useQuery } from '@tanstack/react-query'
import { fetchRepos } from '@/services/github'
import { queryKeys } from './queryKeys'

export function useRepos() {
  return useQuery({ queryKey: queryKeys.repos, queryFn: fetchRepos })
}
