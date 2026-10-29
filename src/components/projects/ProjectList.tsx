import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Repo } from '@/types/github'
import { ProjectCard } from './ProjectCard'
import { ProjectCardSkeleton } from './ProjectCardSkeleton'
import { ProjectsErrorState } from './ProjectsErrorState'
import styles from './ProjectList.module.css'

interface ProjectListProps {
  repos: Repo[] | undefined
  isPending: boolean
  error: Error | null
  onRetry: () => void
  skeletonCount?: number
  headingLevel?: 'h2' | 'h3'
  /** Shows the first project as the main one. */
  highlightFirst?: boolean
}

/** Renders a project list with its loading, error and empty states. */
export function ProjectList({
  repos,
  isPending,
  error,
  onRetry,
  skeletonCount = 3,
  headingLevel,
  highlightFirst = false,
}: ProjectListProps) {
  const { t } = useTranslation()

  if (isPending) {
    return (
      <div aria-busy="true">
        <output className="visually-hidden">{t('projects.loading')}</output>
        <ul className={styles.list} aria-hidden="true">
          {Array.from({ length: skeletonCount }, (_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </ul>
      </div>
    )
  }

  if (error) return <ProjectsErrorState error={error} onRetry={onRetry} />

  if (!repos || repos.length === 0) {
    return (
      <EmptyState title={t('projects.empty.title')} description={t('projects.empty.description')} />
    )
  }

  return (
    <ul className={styles.list}>
      {repos.map((repo, index) => (
        <ProjectCard
          key={repo.name}
          repo={repo}
          headingLevel={headingLevel}
          highlighted={highlightFirst && index === 0}
        />
      ))}
    </ul>
  )
}
