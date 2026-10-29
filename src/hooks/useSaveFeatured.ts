import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveFeaturedNames } from '@/services/featured'
import { queryKeys } from './queryKeys'

export function useSaveFeatured() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (names: string[]) => saveFeaturedNames(names),
    onSuccess: (_data, names) => {
      queryClient.setQueryData(queryKeys.featured, names)
    },
  })
}
