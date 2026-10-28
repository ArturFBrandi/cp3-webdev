import { useTranslation } from 'react-i18next'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { owner, socialLinks } from '@/content/shared'
import { useContent } from '@/hooks/useContent'
import styles from './Hero.module.css'

export function Hero() {
  const { t } = useTranslation()
  const { profile } = useContent()

  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-title">
      <p className={styles.eyebrow}>{profile.role}</p>
      <h1 id="hero-title" className={styles.title}>
        {owner.name}
      </h1>
      <p className={styles.lede}>{profile.lede}</p>
      <div className={styles.actions}>
        <ButtonLink href="#projects">{t('hero.viewProjects')}</ButtonLink>
      </div>
      <div className={styles.links}>
        {socialLinks.map((link) => (
          <ExternalLink key={link.href} href={link.href} arrow>
            {link.label}
          </ExternalLink>
        ))}
      </div>
    </section>
  )
}
