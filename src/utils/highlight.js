export function highlightText(text, matches, key) {
  if (!matches || !text) return escapeHtml(text || '')
  const match = matches.find(m => m.key === key)
  if (!match) return escapeHtml(text)

  const indices = match.indices.filter(([s, e]) => e - s >= 0).sort((a, b) => a[0] - b[0])
  if (!indices.length) return escapeHtml(text)

  let result = ''
  let last = 0
  for (const [start, end] of indices) {
    result += escapeHtml(text.slice(last, start))
    result += `<mark class="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">${escapeHtml(text.slice(start, end + 1))}</mark>`
    last = end + 1
  }
  result += escapeHtml(text.slice(last))
  return result
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
