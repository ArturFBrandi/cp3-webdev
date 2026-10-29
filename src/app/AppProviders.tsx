import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { useState, type ReactNode } from 'react'
import { ThemeProvider } from '@/contexts/ThemeProvider'
import { createQueryClient, persistOptions } from './queryClient'

interface AppProvidersProps {
  children: ReactNode
  /** Tests pass their own client, which also skips localStorage persistence. */
  queryClient?: QueryClient
}

export function AppProviders({ children, queryClient }: AppProvidersProps) {
  const [defaultClient] = useState(createQueryClient)
  const content = <ThemeProvider>{children}</ThemeProvider>

  if (queryClient) {
    return <QueryClientProvider client={queryClient}>{content}</QueryClientProvider>
  }
  return (
    <PersistQueryClientProvider client={defaultClient} persistOptions={persistOptions}>
      {content}
    </PersistQueryClientProvider>
  )
}
