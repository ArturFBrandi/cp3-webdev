import { useTranslation } from 'react-i18next'
import { ProjectList } from '@/components/projects/ProjectList'
import { Section } from '@/components/ui/Section'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useRepos } from '@/hooks/useRepos'
import styles from './ProjectsPage.module.css'

export function ProjectsPage() {
  const { t } = useTranslation()
  useDocumentTitle(t('meta.projects'))
  const { data, isPending, error, refetch } = useRepos()

  return (
    <Section id="projects" title={t('projectsPage.title')}>
      <p className={styles.intro}>{t('projectsPage.description')}</p>
      <ProjectList
        repos={data}
        isPending={isPending}
        error={error}
        onRetry={() => void refetch()}
        skeletonCount={4}
      />
    </Section>
  )
}
