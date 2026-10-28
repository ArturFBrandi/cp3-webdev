import type { ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  children: ReactNode
  as?: 'article' | 'div' | 'li'
  className?: string
}

export function Card({ children, as: Element = 'article', className }: CardProps) {
  return (
    <Element className={[styles.card, className].filter(Boolean).join(' ')}>{children}</Element>
  )
}
