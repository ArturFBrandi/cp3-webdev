import type { Message } from '@/types/messages'
import { getSupabase } from './supabase'

export async function fetchMessages(): Promise<Message[]> {
  const { data, error } = await getSupabase()
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Could not load messages: ${error.message}`)
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    answered: row.answered,
    answeredAt: row.answered_at,
    createdAt: row.created_at,
  }))
}

export async function setMessageAnswered(id: string, answered: boolean): Promise<void> {
  const { error } = await getSupabase()
    .from('messages')
    .update({ answered, answered_at: answered ? new Date().toISOString() : null })
    .eq('id', id)

  if (error) throw new Error(`Could not update message: ${error.message}`)
}
