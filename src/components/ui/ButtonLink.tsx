import type { AnchorHTMLAttributes } from 'react'
import { Link } from 'react-router'
import { buttonClassName, type ButtonSize, type ButtonVariant } from './buttonClassName'

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Internal route; rendered with the router's Link (client-side navigation). */
  to?: string
  /** External or same-page URL; rendered as a plain anchor. */
  href?: string
  variant?: ButtonVariant
  size?: ButtonSize
}

/** A link styled as a Button. */
export function ButtonLink({
  to,
  variant = 'primary',
  size = 'medium',
  className,
  children,
  ...props
}: ButtonLinkProps) {
  const classes = buttonClassName(variant, size, className)
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <a className={classes} {...props}>
      {children}
    </a>
  )
}
