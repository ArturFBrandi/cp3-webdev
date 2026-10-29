import { useQuery } from '@tanstack/react-query'
import { fetchReadme } from '@/services/github'
import { queryKeys } from './queryKeys'

export function useReadme(name: string) {
  return useQuery({ queryKey: queryKeys.readme(name), queryFn: () => fetchReadme(name) })
}
