/** Formats an ISO month ("2023-02") as a short localized month and year ("Feb 2023"). */
export function formatMonth(isoMonth: string, locale: string): string {
  const [year, month] = isoMonth.split('-').map(Number)
  if (!year || !month) return isoMonth
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, month - 1, 1)))
    .replace('.', '')
}
