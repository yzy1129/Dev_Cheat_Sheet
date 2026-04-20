let errorsData = null

async function loadErrors() {
  if (errorsData) return errorsData
  try {
    const res = await fetch('/data/errors.json')
    errorsData = await res.json()
  } catch {
    errorsData = []
  }
  return errorsData
}

export async function matchError(query) {
  const upper = query.toUpperCase().trim()
  const errors = await loadErrors()
  return errors.filter(e => upper.includes(e.code))
}

export function renderErrorCard(container, error) {
  const card = document.createElement('div')
  card.className = 'bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800 p-4 mb-4'
  card.innerHTML = `
    <div class="flex items-center gap-2 mb-2">
      <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
      <code class="font-bold text-red-600 dark:text-red-400">${error.code}</code>
      <span class="text-sm font-medium">${error.title}</span>
    </div>
    <div class="text-sm space-y-2">
      <p><span class="text-gray-500">原因：</span>${error.cause}</p>
      <p><span class="text-gray-500">解决：</span>${error.solution}</p>
      <div class="space-y-1">
        ${error.commands.map(c => `<code class="block px-2 py-1 bg-white dark:bg-gray-900 rounded text-xs font-mono">${c}</code>`).join('')}
      </div>
    </div>
  `
  container.prepend(card)
}
