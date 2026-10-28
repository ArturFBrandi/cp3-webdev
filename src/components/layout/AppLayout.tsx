import { useTranslation } from 'react-i18next'
import { Outlet, ScrollRestoration } from 'react-router'
import styles from './AppLayout.module.css'
import { Footer } from './Footer'
import { Header } from './Header'

/** Root route layout: everything renders inside the header/footer frame. */
export function AppLayout() {
  const { t } = useTranslation()

  return (
    <>
      <a className={styles.skipLink} href="#main">
        {t('nav.skipToContent')}
      </a>
      <Header />
      <main id="main" className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  )
}
