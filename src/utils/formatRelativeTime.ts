export function formatRelativeTime(isoOrDate: unknown): string {
  const date =
    typeof isoOrDate === 'string' || typeof isoOrDate === 'number'
      ? new Date(isoOrDate)
      : isoOrDate instanceof Date
        ? isoOrDate
        : null
  if (!date || Number.isNaN(date.getTime())) return 'Recently'

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `Posted ${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Posted ${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `Posted ${days}d ago`
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}
