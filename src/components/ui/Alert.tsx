import type { ReactNode } from 'react'
import styles from './Alert.module.css'

interface AlertProps {
  tone: 'success' | 'error'
  children: ReactNode
}

/** Inline feedback message. Errors interrupt screen readers; successes are announced politely. */
export function Alert({ tone, children }: AlertProps) {
  const className = `${styles.alert} ${styles[tone]}`
  if (tone === 'error') {
    return (
      <div role="alert" className={className}>
        {children}
      </div>
    )
  }
  return <output className={className}>{children}</output>
}
