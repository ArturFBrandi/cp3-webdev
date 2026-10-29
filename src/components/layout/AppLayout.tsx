import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './AppLayout.module.css'
import { Footer } from './Footer'
import { Header } from './Header'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation()

  return (
    <>
      <a className={styles.skipLink} href="#main">
        {t('nav.skipToContent')}
      </a>
      <Header />
      <main id="main" className={styles.main}>
        {children}
      </main>
      <Footer />
    </>
  )
}
