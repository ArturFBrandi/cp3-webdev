import { portfolioRepos } from '@/content/shared'
import { NotFoundError, RateLimitError } from '@/types/errors'
import type { GitHubRepoResponse, Repo } from '@/types/github'

const API_URL = 'https://api.github.com'

export const GITHUB_USER = import.meta.env.VITE_GITHUB_USER || 'ArturFBrandi'

async function githubFetch(
  path: string,
  accept = 'application/vnd.github+json',
): Promise<Response> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Accept: accept, 'X-GitHub-Api-Version': '2022-11-28' },
  })

  if (response.ok) return response

  const remaining = response.headers.get('x-ratelimit-remaining')
  if ((response.status === 403 || response.status === 429) && remaining === '0') {
    const reset = Number(response.headers.get('x-ratelimit-reset'))
    throw new RateLimitError(
      new Date(Number.isFinite(reset) && reset > 0 ? reset * 1000 : Date.now() + 60 * 60 * 1000),
    )
  }
  if (response.status === 404) throw new NotFoundError(`GitHub resource not found: ${path}`)
  throw new Error(`GitHub API request failed (${response.status}): ${path}`)
}

export function toRepo(repo: GitHubRepoResponse): Repo {
  return {
    name: repo.name,
    description: repo.description,
    language: repo.language,
    topics: repo.topics ?? [],
    stars: repo.stargazers_count,
    htmlUrl: repo.html_url,
    homepage: repo.homepage || null,
    defaultBranch: repo.default_branch,
    pushedAt: repo.pushed_at,
  }
}

/** Whether a repository is on the portfolio list (GitHub names are case-insensitive). */
export function isPortfolioRepo(name: string, names: readonly string[] = portfolioRepos) {
  return names.some((allowed) => allowed.toLowerCase() === name.toLowerCase())
}

/** Keeps only the repositories on the portfolio list, in the list's order. */
export function selectPortfolioRepos(
  repos: GitHubRepoResponse[],
  names: readonly string[] = portfolioRepos,
) {
  const byName = new Map(repos.map((repo) => [repo.name.toLowerCase(), repo]))
  return names.flatMap((name) => byName.get(name.toLowerCase()) ?? [])
}

export async function fetchRepos(): Promise<Repo[]> {
  const response = await githubFetch(`/users/${GITHUB_USER}/repos?per_page=100&type=owner`)
  const repos = (await response.json()) as GitHubRepoResponse[]
  return selectPortfolioRepos(repos).map(toRepo)
}

export async function fetchRepo(name: string): Promise<Repo> {
  if (!isPortfolioRepo(name)) throw new NotFoundError(`Not a portfolio repository: ${name}`)
  const response = await githubFetch(`/repos/${GITHUB_USER}/${encodeURIComponent(name)}`)
  return toRepo((await response.json()) as GitHubRepoResponse)
}

/** Raw README markdown, or null when the repository has none. */
export async function fetchReadme(name: string): Promise<string | null> {
  try {
    const response = await githubFetch(
      `/repos/${GITHUB_USER}/${encodeURIComponent(name)}/readme`,
      'application/vnd.github.raw+json',
    )
    return await response.text()
  } catch (error) {
    if (error instanceof NotFoundError) return null
    throw error
  }
}
