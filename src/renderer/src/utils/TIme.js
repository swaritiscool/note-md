function formatTimestamp(ms) {
  const date = new Date(ms)
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }
  return date.toLocaleString(undefined, options)
}

export const time = formatTimestamp(new Date().getTime())
