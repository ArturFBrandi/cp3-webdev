import type { AnchorHTMLAttributes } from 'react'

interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  /** Appends a ↗ arrow. */
  arrow?: boolean
}

/** A link that opens in a new tab. */
export function ExternalLink({ arrow = false, children, ...props }: ExternalLinkProps) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      {arrow && <span aria-hidden="true"> ↗</span>}
    </a>
  )
}
