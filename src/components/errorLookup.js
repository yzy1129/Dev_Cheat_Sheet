import { t } from '../utils/i18n.js'

let errorsData = null

async function loadErrors() {
  if (errorsData) return errorsData
  try {
    const response = await fetch('/data/errors.json')
    errorsData = await response.json()
  } catch {
    errorsData = []
  }
  return errorsData
}

export async function matchError(query) {
  const upper = query.toUpperCase().trim()
  const errors = await loadErrors()
  return errors.filter(error => upper.includes(error.code))
}

export function renderErrorCard(container, error) {
  const card = document.createElement('div')
  card.className = 'error-panel'
  card.innerHTML = `
    <div class="error-panel__head">
      <div class="error-panel__icon">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 9v2m0 4h.01m-7.938 4h15.876c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
      </div>
      <div>
        <p class="overview-panel__label">${t('error.eyebrow')}</p>
        <div class="flex items-center gap-2 mt-1">
          <code class="error-panel__code">${error.code}</code>
          <span class="error-panel__title">${error.title}</span>
        </div>
      </div>
    </div>
    <div class="error-panel__body">
      <p><span class="error-panel__label-inline">${t('error.cause')}</span>${error.cause}</p>
      <p><span class="error-panel__label-inline">${t('error.solution')}</span>${error.solution}</p>
      <div class="space-y-2">
        ${(error.commands || []).map(command => `<code class="error-panel__command">${command}</code>`).join('')}
      </div>
    </div>
  `
  container.prepend(card)
}
