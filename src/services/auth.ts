import type { Session } from '@supabase/supabase-js'
import { owner } from '@/content/shared'
import { getSupabase } from './supabase'

export type { Session }

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid e-mail or password')
    this.name = 'InvalidCredentialsError'
  }
}

/** Mirrors public.is_owner() in the database policies. */
export function isOwnerEmail(email: string | undefined): boolean {
  return email?.toLowerCase() === owner.email.toLowerCase()
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await getSupabase().auth.getSession()
  if (error) throw error
  return data.session
}

/** Calls `callback` on every sign-in/out; returns an unsubscribe function. */
export function onSessionChange(callback: (session: Session | null) => void): () => void {
  const { data } = getSupabase().auth.onAuthStateChange((_event, session) => callback(session))
  return () => data.subscription.unsubscribe()
}

export async function signIn(email: string, password: string): Promise<Session> {
  const { data, error } = await getSupabase().auth.signInWithPassword({ email, password })
  if (error) {
    if (error.status === 400 || error.code === 'invalid_credentials')
      throw new InvalidCredentialsError()
    throw error
  }
  return data.session
}

export async function signOut(): Promise<void> {
  const { error } = await getSupabase().auth.signOut()
  if (error) throw error
}
