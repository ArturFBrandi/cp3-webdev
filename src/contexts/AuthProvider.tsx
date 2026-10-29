import { useEffect, useMemo, useState, type ReactNode } from 'react'
import * as auth from '@/services/auth'
import { AuthContext, type AuthContextValue } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<auth.Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    auth
      .getSession()
      .then((current) => active && setSession(current))
      .catch(() => active && setSession(null))
      .finally(() => active && setLoading(false))

    const unsubscribe = auth.onSessionChange((next) => {
      setSession(next)
      setLoading(false)
    })
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    const email = session?.user.email
    return {
      status: loading ? 'loading' : session ? 'authenticated' : 'anonymous',
      session,
      email,
      isOwner: auth.isOwnerEmail(email),
      signIn: async (address, password) => {
        setSession(await auth.signIn(address, password))
      },
      signOut: async () => {
        await auth.signOut()
        setSession(null)
      },
    }
  }, [session, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
