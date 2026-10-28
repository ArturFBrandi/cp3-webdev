import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import cardStyles from './ProjectCard.module.css'
import styles from './ProjectCardSkeleton.module.css'

/** Same box as ProjectCard, so swapping it for real content causes no layout shift. */
export function ProjectCardSkeleton() {
  return (
    <Card as="li" className={cardStyles.card}>
      <Skeleton className={styles.meta} />
      <Skeleton className={styles.title} />
      <Skeleton className={styles.tags} />
      <Skeleton className={styles.line} />
      <Skeleton className={`${styles.line} ${styles.short}`} />
    </Card>
  )
}
