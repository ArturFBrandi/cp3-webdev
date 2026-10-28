import { createContext } from 'react'
import type { Session } from '@/services/auth'

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

export interface AuthContextValue {
  status: AuthStatus
  session: Session | null
  email: string | undefined
  isOwner: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
