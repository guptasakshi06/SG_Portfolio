const monthFormat = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })

/** The content validator requires YYYY-MM; UTC keeps month labels stable across time zones. */
export function MonthDate({ value }: { value: string }) {
  return <time dateTime={value}>{monthFormat.format(new Date(`${value}-01T00:00:00Z`))}</time>
}
