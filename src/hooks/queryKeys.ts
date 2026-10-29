/** Every TanStack Query key in the app, so caching and invalidation stay consistent. */
export const queryKeys = {
  repos: ['github', 'repos'] as const,
  repo: (name: string) => ['github', 'repo', name] as const,
  readme: (name: string) => ['github', 'readme', name] as const,
  featured: ['featured'] as const,
  messages: ['messages'] as const,
}
