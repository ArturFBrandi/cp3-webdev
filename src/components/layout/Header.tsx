import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router'
import { owner } from '@/content/shared'
import styles from './Header.module.css'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const { t } = useTranslation()

  return (
    <header className={styles.header}>
      <Link className={styles.logo} to="/" aria-label={t('nav.backToTop')}>
        {owner.initials}
      </Link>
      <nav className={styles.nav} aria-label={t('nav.primary')}>
        <NavLink to="/projects">{t('nav.projects')}</NavLink>
        <Link to="/#about">{t('nav.about')}</Link>
        <Link to="/#experience">{t('nav.experience')}</Link>
        <Link to="/#contact">{t('nav.contact')}</Link>
      </nav>
      <div className={styles.controls}>
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  )
}
