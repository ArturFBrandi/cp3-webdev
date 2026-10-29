import type { ButtonHTMLAttributes } from 'react'
import { buttonClassName, type ButtonSize, type ButtonVariant } from './buttonClassName'
import { Spinner } from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Shows a spinner and disables the button. */
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner size="small" />}
      {children}
    </button>
  )
}
