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

/** Keeps only repositories worth showing: no forks, archived, empty or profile-README repos. */
export function filterPortfolioRepos(repos: GitHubRepoResponse[], user = GITHUB_USER) {
  return repos.filter(
    (repo) =>
      !repo.fork &&
      !repo.archived &&
      repo.size > 0 &&
      repo.name.toLowerCase() !== user.toLowerCase(),
  )
}

export async function fetchRepos(): Promise<Repo[]> {
  const response = await githubFetch(
    `/users/${GITHUB_USER}/repos?per_page=100&type=owner&sort=pushed`,
  )
  const repos = (await response.json()) as GitHubRepoResponse[]
  return filterPortfolioRepos(repos)
    .map(toRepo)
    .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt))
}

export async function fetchRepo(name: string): Promise<Repo> {
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
