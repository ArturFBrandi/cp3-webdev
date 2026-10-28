import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { Section } from '@/components/ui/Section'
import { useContent } from '@/hooks/useContent'
import { useLanguage } from '@/hooks/useLanguage'
import { formatMonth } from '@/utils/format'
import styles from './Experience.module.css'

export function Experience() {
  const { t } = useTranslation()
  const { locale } = useLanguage()
  const { experience } = useContent()

  return (
    <Section id="experience" title={t('sections.experience')}>
      {experience.map((item) => (
        <article key={item.start} className={styles.item}>
          <div className={styles.heading}>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.dates}>
              {formatMonth(item.start, locale)} —{' '}
              {item.end ? formatMonth(item.end, locale) : t('experience.present')}
            </p>
          </div>
          {item.bullets.length > 0 && (
            <ul className={styles.bullets}>
              {item.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
          {item.achievements.map((achievement) => (
            <p key={achievement.title} className={styles.achievement}>
              <strong>{achievement.title}</strong> — {achievement.description}
            </p>
          ))}
          {item.note && (
            <p className={styles.note}>
              {item.note.text}{' '}
              {item.note.links.map((link, index) => (
                <Fragment key={link.href}>
                  {index > 0 && ', '}
                  <ExternalLink href={link.href}>{link.label}</ExternalLink>
                </Fragment>
              ))}
              .
            </p>
          )}
        </article>
      ))}
    </Section>
  )
}
