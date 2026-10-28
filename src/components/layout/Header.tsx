import { useTranslation } from 'react-i18next'
import { owner } from '@/content/shared'
import styles from './Header.module.css'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header() {
  const { t } = useTranslation()

  return (
    <header className={styles.header}>
      <a className={styles.logo} href="#top" aria-label={t('nav.backToTop')}>
        {owner.initials}
      </a>
      <nav className={styles.nav} aria-label={t('nav.primary')}>
        <a href="#projects">{t('nav.projects')}</a>
        <a href="#about">{t('nav.about')}</a>
        <a href="#experience">{t('nav.experience')}</a>
        <a href="#contact">{t('nav.contact')}</a>
      </nav>
      <div className={styles.controls}>
        <LanguageSwitcher />
      </div>
    </header>
  )
}
