import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ProjectList } from '@/components/projects/ProjectList'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Section } from '@/components/ui/Section'
import { useFeaturedRepos } from '@/hooks/useFeaturedRepos'
import styles from './FeaturedProjects.module.css'

export function FeaturedProjects() {
  const { t } = useTranslation()
  const { data, others, isPending, error, refetch } = useFeaturedRepos()
  const [expanded, setExpanded] = useState(false)
  const othersId = useId()

  return (
    <Section id="projects" title={t('sections.featured')}>
      <ProjectList
        repos={data}
        isPending={isPending}
        error={error}
        onRetry={() => void refetch()}
        skeletonCount={3}
        highlightFirst
      />
      {others.length > 0 && (
        <div id={othersId} className={styles.others} hidden={!expanded}>
          <ProjectList repos={others} isPending={false} error={null} onRetry={() => {}} />
        </div>
      )}
      <div className={styles.more}>
        {others.length > 0 && (
          <Button
            variant="ghost"
            aria-expanded={expanded}
            aria-controls={othersId}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? t('projects.showLess') : t('projects.showMore', { count: others.length })}
          </Button>
        )}
        <ButtonLink to="/projects" variant="ghost">
          {t('projects.seeAll')}
        </ButtonLink>
      </div>
    </Section>
  )
}
