import { Outlet } from 'react-router'
import { AuthProvider } from '@/contexts/AuthProvider'

/** Lazy route wrapper: Supabase Auth only loads for /login and /dashboard. */
export function AuthLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}
