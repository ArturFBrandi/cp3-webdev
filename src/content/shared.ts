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
  { label: 'CS106A', href: 'https://github.com/ArturBrandirws/CS106A' },
  { label: 'CS106B', href: 'https://github.com/ArturBrandirws/CS106B' },
  { label: 'CS107', href: 'https://github.com/ArturBrandirws/CS107' },
]
