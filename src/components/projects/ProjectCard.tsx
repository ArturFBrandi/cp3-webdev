import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Card } from '@/components/ui/Card'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { Picture } from '@/components/ui/Picture'
import { TagList } from '@/components/ui/TagList'
import { projectPreviews } from '@/content/projectPreviews'
import { useLanguage } from '@/hooks/useLanguage'
import type { Repo } from '@/types/github'
import { formatRelative } from '@/utils/format'
import styles from './ProjectCard.module.css'

interface ProjectCardProps {
  repo: Repo
  /** Heading level, so cards nest correctly under the page's headings. */
  headingLevel?: 'h2' | 'h3'
}

export function ProjectCard({ repo, headingLevel: Heading = 'h3' }: ProjectCardProps) {
  const { t } = useTranslation()
  const { locale } = useLanguage()
  const detailPath = `/projects/${encodeURIComponent(repo.name)}`
  const preview = projectPreviews[repo.name]

  return (
    <Card as="li" className={styles.card}>
      {preview && (
        <Picture
          className={styles.preview}
          picture={preview}
          alt={t('projects.previewAlt', { name: repo.name })}
          sizes="(max-width: 780px) 100vw, 732px"
        />
      )}
      <p className={styles.meta}>
        {repo.language && <span>{repo.language}</span>}
        <span>{t('projects.updated', { time: formatRelative(repo.pushedAt, locale) })}</span>
        {repo.stars > 0 && <span>{t('projects.stars', { count: repo.stars })}</span>}
      </p>
      <Heading className={styles.title}>
        <Link to={detailPath}>{repo.name}</Link>
      </Heading>
      <TagList tags={repo.topics} label={t('projects.topics')} />
      {repo.description ? (
        <p className={styles.description}>{repo.description}</p>
      ) : (
        <p className={styles.muted}>{t('projects.noDescription')}</p>
      )}
      <div className={styles.links}>
        <Link to={detailPath}>{t('projects.details')}</Link>
        <ExternalLink href={repo.htmlUrl} arrow>
          {t('projects.viewOnGithub')}
        </ExternalLink>
        {repo.homepage && (
          <ExternalLink href={repo.homepage} arrow>
            {t('projects.website')}
          </ExternalLink>
        )}
      </div>
    </Card>
  )
}
