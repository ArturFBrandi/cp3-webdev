import styles from './TagList.module.css'

interface TagListProps {
  tags: string[]
  label?: string
}

export function TagList({ tags, label }: TagListProps) {
  if (tags.length === 0) return null
  return (
    <ul className={styles.list} aria-label={label}>
      {tags.map((tag) => (
        <li key={tag} className={styles.tag}>
          {tag}
        </li>
      ))}
    </ul>
  )
}
