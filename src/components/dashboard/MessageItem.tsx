import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { useLanguage } from '@/hooks/useLanguage'
import type { Message } from '@/types/messages'
import { formatDateTime } from '@/utils/format'
import styles from './MessageItem.module.css'

interface MessageItemProps {
  message: Message
  onToggleAnswered: (message: Message) => void
  disabled?: boolean
}

export function MessageItem({ message, onToggleAnswered, disabled }: MessageItemProps) {
  const { t } = useTranslation()
  const { locale } = useLanguage()
  const headingId = `message-${message.id}`

  return (
    <Card
      as="li"
      className={[styles.item, message.answered && styles.answered].filter(Boolean).join(' ')}
    >
      <div className={styles.header}>
        <h3 id={headingId} className={styles.name}>
          {message.name}
        </h3>
        <a className={styles.email} href={`mailto:${message.email}`}>
          {message.email}
        </a>
      </div>
      <p className={styles.date}>
        {t('dashboard.messages.received', { date: formatDateTime(message.createdAt, locale) })}
      </p>
      <p className={styles.text}>{message.message}</p>
      <div className={styles.footer}>
        <span
          className={[styles.status, message.answered && styles.statusAnswered]
            .filter(Boolean)
            .join(' ')}
        >
          {message.answered ? t('dashboard.messages.answered') : t('dashboard.messages.pending')}
        </span>
        <div className={styles.actions}>
          <ButtonLink
            href={`mailto:${message.email}?subject=${encodeURIComponent('Re: portfolio')}`}
            variant="ghost"
            size="small"
          >
            {t('dashboard.messages.reply')}
          </ButtonLink>
          <Button
            size="small"
            variant={message.answered ? 'ghost' : 'primary'}
            disabled={disabled}
            aria-describedby={headingId}
            onClick={() => onToggleAnswered(message)}
          >
            {message.answered
              ? t('dashboard.messages.markUnanswered')
              : t('dashboard.messages.markAnswered')}
          </Button>
        </div>
      </div>
    </Card>
  )
}
