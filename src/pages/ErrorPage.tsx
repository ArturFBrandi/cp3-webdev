import { useTranslation } from 'react-i18next'
import { isRouteErrorResponse, useRouteError } from 'react-router'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { NotFoundError } from '@/types/errors'
import { NotFoundPage } from './NotFoundPage'
import styles from './NotFoundPage.module.css'

/** Route error boundary: 404s get the friendly not-found page, anything else a retry screen. */
export function ErrorPage() {
  const error = useRouteError()
  const isNotFound =
    error instanceof NotFoundError || (isRouteErrorResponse(error) && error.status === 404)

  if (isNotFound) return <NotFoundPage />
  return <UnexpectedError />
}

function UnexpectedError() {
  const { t } = useTranslation()
  useDocumentTitle(t('meta.error'))

  return (
    <section className={styles.page} aria-labelledby="error-title" role="alert">
      <h1 id="error-title" className={styles.title}>
        {t('error.title')}
      </h1>
      <p className={styles.description}>{t('error.description')}</p>
      <div className={styles.actions}>
        <Button onClick={() => window.location.reload()}>{t('error.retry')}</Button>
        <ButtonLink to="/" variant="ghost">
          {t('error.backHome')}
        </ButtonLink>
      </div>
    </section>
  )
}
