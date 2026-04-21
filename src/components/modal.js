import { copyToClipboard } from '../utils/clipboard.js'
import {
  t,
  translateCategory,
  translateGroupTitle,
  translateTag
} from '../utils/i18n.js'
import { showToast } from './toast.js'

let overlay = null

export function showModal(item) {
  closeModal()

  overlay = document.createElement('div')
  overlay.className = 'modal-shell modal-overlay-enter'
  overlay.addEventListener('click', event => {
    if (event.target === overlay) closeModal()
  })

  const detail = item.detail || {}
  const eyebrow = item.category
    ? translateCategory(item.category)
    : translateGroupTitle(item.groupId, item.groupTitle || t('modal.fallbackTitle'))

  overlay.innerHTML = `
    <div class="modal-card modal-content-enter" id="modal-content">
      <div class="modal-card__header">
        <div class="min-w-0">
          <p class="modal-card__eyebrow">${escapeHtml(eyebrow || t('modal.fallbackTitle'))}</p>
          <code class="modal-card__command">${escapeHtml(item.cmd)}</code>
          <p class="modal-card__desc">${escapeHtml(item.desc)}</p>
        </div>
        <button id="modal-close" class="modal-icon-btn" aria-label="${escapeHtml(t('modal.close'))}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 18 18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="modal-card__meta">
        ${(item.tags || []).map(tag => `<span class="state-chip">${escapeHtml(translateTag(tag))}</span>`).join('')}
      </div>

      <div class="modal-card__actions">
        <button id="modal-copy" class="primary-button">${escapeHtml(t('modal.copy'))}</button>
        <button id="modal-ask-ai" class="secondary-button">${escapeHtml(t('modal.askAI'))}</button>
      </div>

      <div class="modal-card__body">
        ${detail.usage ? section(t('modal.usage'), detail.usage) : ''}
        ${detail.example ? codeSection(t('modal.example'), detail.example) : ''}
        ${detail.notes ? noteSection(t('modal.notes'), detail.notes) : ''}
        ${!detail.usage && !detail.example && !detail.notes ? `<div class="modal-card__empty">${escapeHtml(t('modal.empty'))}</div>` : ''}
      </div>
    </div>
  `

  document.body.appendChild(overlay)

  overlay.querySelector('#modal-close').addEventListener('click', closeModal)
  overlay.querySelector('#modal-copy').addEventListener('click', () => {
    copyToClipboard(item.code || item.cmd)
    showToast(t('card.copied'))
  })
  overlay.querySelector('#modal-ask-ai').addEventListener('click', () => {
    closeModal()
    const input = document.getElementById('search-input')
    if (!input) return
    input.value = item.cmd
    input.dispatchEvent(new Event('input'))
  })
}

export function closeModal() {
  if (!overlay) return
  overlay.style.opacity = '0'
  overlay.style.transition = 'opacity 0.18s ease'
  const current = overlay
  overlay = null
  setTimeout(() => current.remove(), 180)
}

function section(title, content) {
  return `
    <section class="modal-section">
      <div class="modal-section__title">${title}</div>
      <p class="modal-section__text">${escapeHtml(content)}</p>
    </section>
  `
}

function codeSection(title, code) {
  return `
    <section class="modal-section">
      <div class="modal-section__title">${title}</div>
      <pre class="modal-code"><code>${escapeHtml(code)}</code></pre>
    </section>
  `
}

function noteSection(title, content) {
  return `
    <section class="modal-note">
      <div class="modal-section__title">${title}</div>
      <p class="modal-section__text">${escapeHtml(content)}</p>
    </section>
  `
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
