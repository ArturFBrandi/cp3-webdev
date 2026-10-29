import { useMutation } from '@tanstack/react-query'
import { sendContactMessage } from '@/services/contact'

export function useSendContactMessage() {
  return useMutation({ mutationFn: sendContactMessage })
}
