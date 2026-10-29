import styles from './Skeleton.module.css'

interface SkeletonProps {
  /** Sets the size from the parent's CSS Module. */
  className?: string
}

/** A shimmering placeholder block. Decorative: the parent announces the loading state. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <span className={[styles.skeleton, className].filter(Boolean).join(' ')} aria-hidden="true" />
  )
}
