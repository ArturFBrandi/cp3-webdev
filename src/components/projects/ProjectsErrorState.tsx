import { useTranslation } from 'react-i18next'
import { ErrorState } from '@/components/ui/ErrorState'
import { useLanguage } from '@/hooks/useLanguage'
import { RateLimitError } from '@/types/errors'
import { formatTime } from '@/utils/format'

interface ProjectsErrorStateProps {
  error: Error
  onRetry: () => void
}

export function ProjectsErrorState({ error, onRetry }: ProjectsErrorStateProps) {
  const { t } = useTranslation()
  const { locale } = useLanguage()

  const description =
    error instanceof RateLimitError
      ? t('projects.errors.rateLimit', { time: formatTime(error.resetAt, locale) })
      : t('projects.errors.generic')

  return (
    <ErrorState
      title={t('projects.errors.title')}
      description={description}
      retryLabel={t('projects.errors.retry')}
      onRetry={onRetry}
    />
  )
}
