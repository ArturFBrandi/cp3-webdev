import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'
import { ProjectsErrorState } from '@/components/projects/ProjectsErrorState'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { TagList } from '@/components/ui/TagList'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useLanguage } from '@/hooks/useLanguage'
import { useReadme } from '@/hooks/useReadme'
import { useRepo } from '@/hooks/useRepo'
import { NotFoundError } from '@/types/errors'
import type { Repo } from '@/types/github'
import { formatRelative } from '@/utils/format'
import { NotFoundPage } from './NotFoundPage'
import styles from './ProjectDetailPage.module.css'

// react-markdown is only needed here: keep it out of the main bundle.
const ReadmeViewer = lazy(() =>
  import('@/components/projects/ReadmeViewer').then((module) => ({ default: module.ReadmeViewer })),
)

export function ProjectDetailPage() {
  const { t } = useTranslation()
  const { name = '' } = useParams()
  const { data: repo, isPending, error, refetch } = useRepo(name)
  useDocumentTitle(t('meta.project', { name }))

  if (error instanceof NotFoundError) return <NotFoundPage />

  return (
    <article className={styles.page} aria-busy={isPending}>
      <Link className={styles.back} to="/projects">
        <span aria-hidden="true">← </span>
        {t('projectDetail.back')}
      </Link>
      {isPending && <DetailSkeleton />}
      {error && <ProjectsErrorState error={error} onRetry={() => void refetch()} />}
      {repo && <ProjectDetail repo={repo} />}
    </article>
  )
}

function ProjectDetail({ repo }: { repo: Repo }) {
  const { t } = useTranslation()
  const { locale } = useLanguage()

  return (
    <>
      <p className={styles.meta}>
        {repo.language && <span>{repo.language}</span>}
        <span>{t('projects.updated', { time: formatRelative(repo.pushedAt, locale) })}</span>
        {repo.stars > 0 && <span>{t('projects.stars', { count: repo.stars })}</span>}
      </p>
      <h1 className={styles.title}>{repo.name}</h1>
      <p className={styles.description}>{repo.description ?? t('projects.noDescription')}</p>
      <TagList tags={repo.topics} label={t('projects.topics')} />
      <div className={styles.links}>
        <ButtonLink href={repo.htmlUrl} target="_blank" rel="noopener noreferrer" arrow>
          {t('projects.viewOnGithub')}
        </ButtonLink>
        {repo.homepage && (
          <ButtonLink
            href={repo.homepage}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            arrow
          >
            {t('projects.website')}
          </ButtonLink>
        )}
      </div>
      <Readme repo={repo} />
    </>
  )
}

function Readme({ repo }: { repo: Repo }) {
  const { t } = useTranslation()
  const { data: markdown, isPending, isError, refetch } = useReadme(repo.name)
  const skeleton = <Skeleton className={styles.skeletonBlock} />

  return (
    <section aria-labelledby="readme-title">
      <h2 id="readme-title" className={styles.readmeTitle}>
        {t('projectDetail.readme')}
      </h2>
      {isPending && skeleton}
      {isError && (
        <ErrorState
          title={t('projectDetail.readmeError')}
          retryLabel={t('projects.errors.retry')}
          onRetry={() => void refetch()}
        />
      )}
      {markdown === null && <p className={styles.muted}>{t('projectDetail.noReadme')}</p>}
      {markdown && (
        <Suspense fallback={skeleton}>
          <ReadmeViewer markdown={markdown} repo={repo} />
        </Suspense>
      )}
    </section>
  )
}

function DetailSkeleton() {
  const { t } = useTranslation()
  return (
    <div>
      <output className="visually-hidden">{t('projectDetail.loading')}</output>
      <Skeleton className={styles.skeletonMeta} />
      <Skeleton className={styles.skeletonTitle} />
      <Skeleton className={styles.skeletonLine} />
      <Skeleton className={styles.skeletonLine} />
      <Skeleton className={styles.skeletonBlock} />
    </div>
  )
}
