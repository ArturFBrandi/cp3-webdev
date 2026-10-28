import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'ghost'
export type ButtonSize = 'medium' | 'small'

export function buttonClassName(variant: ButtonVariant, size: ButtonSize, extra?: string) {
  return [styles.button, styles[variant], size === 'small' && styles.small, extra]
    .filter(Boolean)
    .join(' ')
}
