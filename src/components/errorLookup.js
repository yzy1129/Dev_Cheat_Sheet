import { getLocale, t } from '../utils/i18n.js'

let errorsData = null

async function loadErrors() {
  if (errorsData) return errorsData

  try {
    const [zhResponse, enResponse] = await Promise.all([
      fetch('/data/errors.json'),
      fetch('/data/errors.en.json')
    ])

    const [zhErrors, enErrors] = await Promise.all([
      zhResponse.ok ? zhResponse.json() : [],
      enResponse.ok ? enResponse.json() : []
    ])

    const enErrorsByCode = new Map(enErrors.map(error => [error.code, error]))

    errorsData = zhErrors.map(error => ({
      ...error,
      i18n: {
        zh: {
          title: error.title,
          cause: error.cause,
          solution: error.solution
        },
        en: {
          title: enErrorsByCode.get(error.code)?.title || error.title,
          cause: enErrorsByCode.get(error.code)?.cause || error.cause,
          solution: enErrorsByCode.get(error.code)?.solution || error.solution
        }
      }
    }))
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
  const locale = getLocale()
  const localized = error.i18n?.[locale] || error.i18n?.zh || error
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
          <span class="error-panel__title">${localized.title}</span>
        </div>
      </div>
    </div>
    <div class="error-panel__body">
      <p><span class="error-panel__label-inline">${t('error.cause')}</span>${localized.cause}</p>
      <p><span class="error-panel__label-inline">${t('error.solution')}</span>${localized.solution}</p>
      <div class="space-y-2">
        ${(error.commands || []).map(command => `<code class="error-panel__command">${command}</code>`).join('')}
      </div>
    </div>
  `
  container.prepend(card)
}
