import type { GitHubRepoResponse, Repo } from '@/types/github'

export function makeRepo(overrides: Partial<Repo> = {}): Repo {
  return {
    name: 'smartlar-manager',
    description: 'Management system for a smart-home installation company',
    language: 'TypeScript',
    topics: ['react', 'supabase'],
    stars: 0,
    htmlUrl: 'https://github.com/ArturFBrandi/smartlar-manager',
    homepage: null,
    defaultBranch: 'main',
    pushedAt: '2026-10-03T14:31:16Z',
    ...overrides,
  }
}

export function makeRepoResponse(overrides: Partial<GitHubRepoResponse> = {}): GitHubRepoResponse {
  return {
    name: 'smartlar-manager',
    description: null,
    language: 'TypeScript',
    topics: [],
    stargazers_count: 0,
    html_url: 'https://github.com/ArturFBrandi/smartlar-manager',
    homepage: null,
    default_branch: 'main',
    pushed_at: '2026-10-03T14:31:16Z',
    fork: false,
    archived: false,
    size: 242,
    ...overrides,
  }
}
