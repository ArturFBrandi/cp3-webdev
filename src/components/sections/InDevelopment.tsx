import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { TagList } from '@/components/ui/TagList'
import { useContent } from '@/hooks/useContent'
import styles from './InDevelopment.module.css'

export function InDevelopment() {
  const { t } = useTranslation()
  const { inDevelopment } = useContent()

  if (inDevelopment.length === 0) return null

  return (
    <Section id="in-development" title={t('sections.inDevelopment')}>
      <div className={styles.list}>
        {inDevelopment.map((project) => (
          <Card key={project.name}>
            <p className={styles.status}>{project.status}</p>
            <h3 className={styles.name}>{project.name}</h3>
            <TagList tags={project.tags} />
            <p>{project.description}</p>
            <p className={styles.note}>{project.linkNote}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}
