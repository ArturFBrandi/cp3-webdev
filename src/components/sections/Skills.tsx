import { useTranslation } from 'react-i18next'
import { Section } from '@/components/ui/Section'
import { useContent } from '@/hooks/useContent'
import styles from './Skills.module.css'

export function Skills() {
  const { t } = useTranslation()
  const { skills } = useContent()

  return (
    <Section id="about" title={t('sections.skills')}>
      <div className={styles.grid}>
        {skills.map((group) => (
          <div key={group.title}>
            <h3 className={styles.title}>{group.title}</h3>
            <p className={styles.items}>{group.items}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
