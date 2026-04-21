import { queryAIStream } from '../utils/aiClient.js'
import { getLocale, t } from '../utils/i18n.js'

let currentQuery = ''

export function renderAIPrompt(container, query) {
  const queryKey = `${getLocale()}::${query}`
  if (queryKey === currentQuery && container.children.length > 0) return
  currentQuery = queryKey

  container.innerHTML = `
    <section class="ai-panel">
      <div class="ai-panel__head">
        <div class="ai-panel__icon">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
        </div>
        <div>
          <p class="overview-panel__label">${escapeHtml(t('ai.eyebrow'))}</p>
          <h3 class="ai-panel__title">${escapeHtml(t('ai.title'))}</h3>
        </div>
      </div>
      <p class="ai-panel__desc">${escapeHtml(t('ai.desc', { query }))}</p>
      <button id="ai-ask-btn" class="primary-button">${escapeHtml(t('ai.ask'))}</button>
      <div id="ai-result" class="ai-stream hidden"></div>
    </section>
  `

  container.querySelector('#ai-ask-btn').addEventListener('click', () => {
    const resultEl = container.querySelector('#ai-result')
    const btn = container.querySelector('#ai-ask-btn')

    btn.disabled = true
    btn.textContent = t('ai.loading')
    resultEl.classList.remove('hidden')
    resultEl.innerHTML = `
      <pre id="ai-stream-text" class="ai-stream__text"></pre>
      <span id="ai-cursor" class="ai-stream__cursor"></span>
    `

    const textEl = resultEl.querySelector('#ai-stream-text')
    const cursor = resultEl.querySelector('#ai-cursor')

    queryAIStream(
      query,
      chunk => { textEl.textContent += chunk },
      () => {
        cursor.remove()
        btn.classList.add('hidden')
      },
      error => {
        resultEl.innerHTML = `<p class="text-sm text-rose-500">${escapeHtml(t('ai.unavailable', { message: error.message }))}</p>`
        btn.disabled = false
        btn.textContent = t('ai.ask')
      }
    )
  })
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
