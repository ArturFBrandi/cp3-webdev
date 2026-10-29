import { useTranslation } from 'react-i18next'
import { NavLink, Outlet } from 'react-router'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import styles from './DashboardLayout.module.css'

export function DashboardLayout() {
  const { t } = useTranslation()
  useDocumentTitle(t('meta.dashboard'))
  const { email, signOut } = useAuth()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('dashboard.title')}</h1>
          <p className={styles.user}>{t('dashboard.signedInAs', { email })}</p>
        </div>
        <Button variant="ghost" size="small" onClick={() => void signOut()}>
          {t('dashboard.signOut')}
        </Button>
      </header>
      <nav className={styles.tabs} aria-label={t('dashboard.sections')}>
        <NavLink className={styles.tab} to="/dashboard/messages">
          {t('dashboard.tabs.messages')}
        </NavLink>
        <NavLink className={styles.tab} to="/dashboard/featured">
          {t('dashboard.tabs.featured')}
        </NavLink>
      </nav>
      <Outlet />
    </div>
  )
}
