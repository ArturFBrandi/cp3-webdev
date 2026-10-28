import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ProjectsErrorState } from '@/components/projects/ProjectsErrorState'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useFeaturedNames } from '@/hooks/useFeaturedRepos'
import { useRepos } from '@/hooks/useRepos'
import { useSaveFeatured } from '@/hooks/useSaveFeatured'
import type { Repo } from '@/types/github'
import styles from './FeaturedPage.module.css'

export function FeaturedPage() {
  const { t } = useTranslation()
  const repos = useRepos()
  const featured = useFeaturedNames()
  // Lives here, not in the form, so the result survives the form remounting after a save.
  const save = useSaveFeatured()

  if (repos.isPending || featured.isPending) {
    return (
      <div aria-busy="true">
        <output className="visually-hidden">{t('projects.loading')}</output>
        <Skeleton className={styles.skeleton} />
      </div>
    )
  }
  if (repos.error)
    return <ProjectsErrorState error={repos.error} onRetry={() => void repos.refetch()} />
  if (repos.data.length === 0) {
    return (
      <EmptyState title={t('projects.empty.title')} description={t('projects.empty.description')} />
    )
  }

  // Keyed so the form restarts from the saved list if it changes elsewhere.
  return (
    <FeaturedForm
      key={(featured.data ?? []).join(',')}
      repos={repos.data}
      save={save}
      initial={(featured.data ?? []).filter((name) =>
        repos.data.some((repo) => repo.name === name),
      )}
    />
  )
}

interface FeaturedFormProps {
  repos: Repo[]
  initial: string[]
  save: ReturnType<typeof useSaveFeatured>
}

function FeaturedForm({ repos, initial, save }: FeaturedFormProps) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<string[]>(initial)
  const changed = selected.join(',') !== initial.join(',')

  const toggle = (name: string) => {
    save.reset()
    setSelected((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    )
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        save.mutate(selected)
      }}
    >
      <p className={styles.description}>{t('dashboard.featured.description')}</p>
      <ul className={styles.list}>
        {repos.map((repo) => {
          const position = selected.indexOf(repo.name)
          return (
            <li key={repo.name} className={styles.item}>
              <label className={styles.option}>
                <input
                  type="checkbox"
                  checked={position !== -1}
                  onChange={() => toggle(repo.name)}
                />
                <span className={styles.name}>{repo.name}</span>
                {repo.language && <span className={styles.language}>{repo.language}</span>}
                {position !== -1 && (
                  <span className={styles.position}>
                    {t('dashboard.featured.position', { position: position + 1 })}
                  </span>
                )}
              </label>
            </li>
          )
        })}
      </ul>
      <div className={styles.actions}>
        <Button type="submit" loading={save.isPending} disabled={!changed}>
          {save.isPending ? t('dashboard.featured.saving') : t('dashboard.featured.save')}
        </Button>
        <span className={styles.count}>
          {t('dashboard.featured.selected', { count: selected.length })}
        </span>
      </div>
      <div className={styles.feedback}>
        {save.isSuccess && <Alert tone="success">{t('dashboard.featured.saved')}</Alert>}
        {save.isError && <Alert tone="error">{t('dashboard.featured.saveError')}</Alert>}
      </div>
    </form>
  )
}
