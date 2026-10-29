import { useTranslation } from 'react-i18next'
import { MessageItem } from '@/components/dashboard/MessageItem'
import { Alert } from '@/components/ui/Alert'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useMessages, useSetMessageAnswered } from '@/hooks/useMessages'
import styles from './MessagesPage.module.css'

export function MessagesPage() {
  const { t } = useTranslation()
  const { data: messages, isPending, error, refetch } = useMessages()
  const setAnswered = useSetMessageAnswered()

  if (isPending) {
    return (
      <div aria-busy="true">
        <output className="visually-hidden">{t('dashboard.messages.loading')}</output>
        <div className={styles.list}>
          <Skeleton className={styles.skeleton} />
          <Skeleton className={styles.skeleton} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        title={t('dashboard.messages.error.title')}
        description={t('dashboard.messages.error.description')}
        retryLabel={t('dashboard.messages.error.retry')}
        onRetry={() => void refetch()}
      />
    )
  }

  if (messages.length === 0) {
    return (
      <EmptyState
        title={t('dashboard.messages.empty.title')}
        description={t('dashboard.messages.empty.description')}
      />
    )
  }

  const unanswered = messages.filter((message) => !message.answered).length

  return (
    <>
      <p className={styles.summary}>
        {t('dashboard.messages.unansweredCount', { count: unanswered })}
      </p>
      {setAnswered.isError && (
        <div className={styles.feedback}>
          <Alert tone="error">{t('dashboard.messages.updateError')}</Alert>
        </div>
      )}
      <ul className={styles.list}>
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            disabled={setAnswered.isPending && setAnswered.variables?.id === message.id}
            onToggleAnswered={({ id, answered }) => setAnswered.mutate({ id, answered: !answered })}
          />
        ))}
      </ul>
    </>
  )
}
