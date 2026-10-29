import type { AnchorHTMLAttributes } from 'react'
import { buttonClassName, type ButtonSize, type ButtonVariant } from './buttonClassName'

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
}

/** An anchor styled as a Button. */
export function ButtonLink({
  variant = 'primary',
  size = 'medium',
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a className={buttonClassName(variant, size, className)} {...props}>
      {children}
    </a>
  )
}
