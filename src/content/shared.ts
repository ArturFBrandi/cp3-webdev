import type { Link } from '@/types/content'

/** Content that is the same in every language. */
export const owner = {
  name: 'Artur Brandi',
  initials: 'AB',
  email: 'arturbrandi5@gmail.com',
}

export const socialLinks: Link[] = [
  { label: 'GitHub', href: 'https://github.com/ArturFBrandi' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/arturbrandi' },
]

export const courseLinks: Link[] = [
  { label: 'CS106A', href: 'https://github.com/ArturFBrandi/CS106A' },
  { label: 'CS106B', href: 'https://github.com/ArturFBrandi/CS106B' },
  { label: 'CS107', href: 'https://github.com/ArturFBrandi/CS107' },
]

/**
 * The only GitHub repositories the portfolio shows, in display order. Any other public repo stays
 * hidden: from the lists, the dashboard picker and `/projects/:name`.
 */
export const portfolioRepos = [
  'ai-hardcore-engineer-v2',
  'smartlar-manager',
  'aseprite-compiler',
  'RetroPalette',
  'CS107',
  'CS106B',
  'CS106A',
]
