import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, useLocation } from 'react-router'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import styles from './ProtectedRoute.module.css'

/** Lets only the signed-in owner through; anyone else goes to /login and comes back after. */
export function ProtectedRoute() {
  const { t } = useTranslation()
  const { status, isOwner, email, signOut } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className={styles.center}>
        <Spinner label={t('auth.checking')} />
      </div>
    )
  }

  if (status === 'anonymous') {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }

  if (!isOwner) {
    return (
      <div className={styles.center}>
        <ErrorState
          title={t('dashboard.denied.title')}
          description={t('dashboard.denied.description', { email })}
        >
          <Button variant="ghost" onClick={() => void signOut()}>
            {t('dashboard.signOut')}
          </Button>
        </ErrorState>
      </div>
    )
  }

  return <Outlet />
}
