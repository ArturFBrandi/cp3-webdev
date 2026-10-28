import { useTranslation } from 'react-i18next'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  const { t } = useTranslation()
  useDocumentTitle(t('meta.notFound'))

  return (
    <section className={styles.page} aria-labelledby="not-found-title">
      <p className={styles.code} aria-hidden="true">
        404
      </p>
      <h1 id="not-found-title" className={styles.title}>
        {t('notFound.title')}
      </h1>
      <p className={styles.description}>{t('notFound.description')}</p>
      <div className={styles.actions}>
        <ButtonLink to="/">{t('notFound.backHome')}</ButtonLink>
      </div>
    </section>
  )
}
