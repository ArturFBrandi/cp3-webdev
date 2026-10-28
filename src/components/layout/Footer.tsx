import { useTranslation } from 'react-i18next'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { owner, socialLinks } from '@/content/shared'
import { useContent } from '@/hooks/useContent'
import styles from './Footer.module.css'

const currentYear = new Date().getFullYear()

export function Footer() {
  const { t } = useTranslation()
  const { profile } = useContent()

  return (
    <footer className={styles.footer}>
      <p className={styles.meta}>
        {profile.location} · {profile.availability}
      </p>
      <div className={styles.links}>
        <a href={`mailto:${owner.email}`}>{owner.email}</a>
        {socialLinks.map((link) => (
          <ExternalLink key={link.href} href={link.href}>
            {link.label}
          </ExternalLink>
        ))}
      </div>
      <p className={styles.copy}>{t('footer.copyright', { year: currentYear })}</p>
    </footer>
  )
}
