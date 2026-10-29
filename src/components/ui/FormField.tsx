import type { ReactNode } from 'react'
import styles from './FormField.module.css'

interface FormFieldProps {
  id: string
  label: string
  hint?: string
  /** Already-translated error message. */
  error?: string
  children: (control: {
    id: string
    className: string | undefined
    'aria-invalid': boolean
    'aria-describedby': string | undefined
  }) => ReactNode
}

/** Label, control, hint and error wired together for screen readers. */
export function FormField({ id, label, hint, error, children }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {children({
        id,
        className: styles.control,
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy,
      })}
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
    </div>
  )
}
