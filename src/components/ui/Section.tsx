import type { ReactNode } from 'react'
import styles from './Section.module.css'

interface SectionProps {
  id?: string
  title: string
  children: ReactNode
  className?: string
}

export function Section({ id, title, children, className }: SectionProps) {
  const headingId = id ? `${id}-title` : undefined
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={[styles.section, className].filter(Boolean).join(' ')}
    >
      <h2 id={headingId} className={styles.title}>
        {title}
      </h2>
      {children}
    </section>
  )
}
