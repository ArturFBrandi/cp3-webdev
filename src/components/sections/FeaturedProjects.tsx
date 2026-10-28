import { useTranslation } from 'react-i18next'
import { ProjectList } from '@/components/projects/ProjectList'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Section } from '@/components/ui/Section'
import { useFeaturedRepos } from '@/hooks/useFeaturedRepos'
import styles from './FeaturedProjects.module.css'

export function FeaturedProjects() {
  const { t } = useTranslation()
  const { data, isPending, error, refetch } = useFeaturedRepos()

  return (
    <Section id="projects" title={t('sections.featured')}>
      <ProjectList
        repos={data}
        isPending={isPending}
        error={error}
        onRetry={() => void refetch()}
        skeletonCount={2}
      />
      <div className={styles.more}>
        <ButtonLink to="/projects" variant="ghost">
          {t('projects.seeAll')}
        </ButtonLink>
      </div>
    </Section>
  )
}
