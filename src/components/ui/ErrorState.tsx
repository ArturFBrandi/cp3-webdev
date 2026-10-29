import type { ReactNode } from 'react'
import { Button } from './Button'
import styles from './StateMessage.module.css'

interface ErrorStateProps {
  title: string
  description?: string
  retryLabel?: string
  onRetry?: () => void
  /** Extra actions, e.g. a link back home. */
  children?: ReactNode
}

export function ErrorState({ title, description, retryLabel, onRetry, children }: ErrorStateProps) {
  return (
    <div className={`${styles.state} ${styles.error}`} role="alert">
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {(onRetry || children) && (
        <div className={styles.actions}>
          {onRetry && retryLabel && (
            <Button variant="ghost" onClick={onRetry}>
              {retryLabel}
            </Button>
          )}
          {children}
        </div>
      )}
    </div>
  )
}
