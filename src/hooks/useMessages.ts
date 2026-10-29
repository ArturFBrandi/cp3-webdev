import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchMessages, setMessageAnswered } from '@/services/messages'
import type { Message } from '@/types/messages'
import { queryKeys } from './queryKeys'

export function useMessages() {
  return useQuery({ queryKey: queryKeys.messages, queryFn: fetchMessages, staleTime: 0 })
}

/** Marks a message as answered (or not), updating the list immediately and rolling back on error. */
export function useSetMessageAnswered() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, answered }: { id: string; answered: boolean }) =>
      setMessageAnswered(id, answered),
    onMutate: async ({ id, answered }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.messages })
      const previous = queryClient.getQueryData<Message[]>(queryKeys.messages)
      queryClient.setQueryData<Message[]>(queryKeys.messages, (messages) =>
        messages?.map((message) =>
          message.id === id
            ? { ...message, answered, answeredAt: answered ? new Date().toISOString() : null }
            : message,
        ),
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKeys.messages, context?.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.messages }),
  })
}
