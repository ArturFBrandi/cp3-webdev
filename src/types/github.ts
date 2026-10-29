/** A GitHub repository as the portfolio uses it (mapped from the REST API shape). */
export interface Repo {
  name: string
  description: string | null
  language: string | null
  topics: string[]
  stars: number
  htmlUrl: string
  homepage: string | null
  defaultBranch: string
  pushedAt: string
}

/** The subset of GitHub's REST repository payload the app reads. */
export interface GitHubRepoResponse {
  name: string
  description: string | null
  language: string | null
  topics?: string[]
  stargazers_count: number
  html_url: string
  homepage: string | null
  default_branch: string
  pushed_at: string
  fork: boolean
  archived: boolean
  size: number
}
