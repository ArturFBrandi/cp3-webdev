import { defaultUrlTransform } from 'react-markdown'
import { GITHUB_USER } from '@/services/github'
import type { Repo } from '@/types/github'

const ABSOLUTE_URL = /^([a-z][a-z\d+.-]*:|#|\/\/)/i

/** Resolves README-relative links and images against the repository on GitHub. */
export function resolveReadmeUrl(url: string, key: string, repo: Repo): string {
  const safe = defaultUrlTransform(url)
  if (!safe || ABSOLUTE_URL.test(safe)) return safe
  const path = safe.replace(/^\.?\//, '')
  const base =
    key === 'src'
      ? `https://raw.githubusercontent.com/${GITHUB_USER}/${repo.name}/${repo.defaultBranch}/`
      : `https://github.com/${GITHUB_USER}/${repo.name}/blob/${repo.defaultBranch}/`
  return new URL(path, base).toString()
}
