/** Formats an ISO month ("2023-02") as a short localized month and year ("Feb 2023"). */
export function formatMonth(isoMonth: string, locale: string): string {
  const [year, month] = isoMonth.split('-').map(Number)
  if (!year || !month) return isoMonth
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, month - 1, 1)))
    .replace('.', '')
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60],
  ['month', 30 * 24 * 60 * 60],
  ['week', 7 * 24 * 60 * 60],
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60],
]

/** "3 days ago" / "há 3 dias", relative to `now`. */
export function formatRelative(isoDate: string, locale: string, now = Date.now()): string {
  const seconds = (new Date(isoDate).getTime() - now) / 1000
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  for (const [unit, size] of RELATIVE_UNITS) {
    if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit)
  }
  return formatter.format(0, 'minute')
}

/** "14:05" / "2:05 PM" in the visitor's locale. */
export function formatTime(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }).format(date)
}

/** "Oct 28, 2026, 3:05 PM" / "28 de out. de 2026, 15:05". */
export function formatDateTime(isoDate: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(isoDate),
  )
}
