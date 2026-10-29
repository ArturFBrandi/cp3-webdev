import styles from './Spinner.module.css'

interface SpinnerProps {
  size?: 'small' | 'medium'
  /** Accessible label. Omit when the spinner sits inside a labelled control. */
  label?: string
}

export function Spinner({ size = 'medium', label }: SpinnerProps) {
  const className = [styles.spinner, size === 'small' && styles.small].filter(Boolean).join(' ')
  if (!label) return <span className={className} aria-hidden="true" />
  return (
    <output>
      <span className={className} aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </output>
  )
}
