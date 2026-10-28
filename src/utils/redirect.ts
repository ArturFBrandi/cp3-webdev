/** Only same-site paths are allowed as post-login redirects (blocks `//evil.com` and `https://…`). */
export function safeRedirect(target: string | null, fallback = '/dashboard'): string {
  if (!target || !target.startsWith('/') || target.startsWith('//') || target.includes('\\')) {
    return fallback
  }
  return target
}
