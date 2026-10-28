import { QueryClient } from '@tanstack/react-query'
import type { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import type { ComponentProps } from 'react'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { NotFoundError, RateLimitError } from '@/types/errors'

const MINUTE = 60 * 1000

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // GitHub allows 60 unauthenticated requests per hour: cache aggressively.
        staleTime: 10 * MINUTE,
        gcTime: 60 * MINUTE,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) =>
          !(error instanceof RateLimitError || error instanceof NotFoundError) && failureCount < 2,
      },
    },
  })
}

/** Persists GitHub queries in localStorage, so reloading the page doesn't spend the rate limit. */
export const queryPersister = createSyncStoragePersister({
  storage: typeof window === 'undefined' ? undefined : window.localStorage,
  key: 'portfolio-query-cache',
})

export const persistOptions: ComponentProps<typeof PersistQueryClientProvider>['persistOptions'] = {
  persister: queryPersister,
  maxAge: 60 * MINUTE,
  buster: 'v1',
  dehydrateOptions: {
    shouldDehydrateQuery: (query) =>
      query.queryKey[0] === 'github' && query.state.status === 'success',
  },
}
