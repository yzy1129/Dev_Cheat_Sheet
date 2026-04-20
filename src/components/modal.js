let overlay = null

export function showModal(item) {
  closeModal()
  overlay = document.createElement('div')
  overlay.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay-enter'
  overlay.style.background = 'rgba(0,0,0,0.4)'
  overlay.style.backdropFilter = 'blur(4px)'
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal() })

  const detail = item.detail || {}
  overlay.innerHTML = `
    <div class="modal-content-enter bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-black/20 max-w-lg w-full max-h-[80vh] overflow-y-auto" id="modal-content">
      <div class="p-6 pb-0">
        <div class="flex items-start justify-between gap-3 mb-1">
          <code class="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">${escapeHtml(item.cmd)}</code>
          <button id="modal-close" class="p-1.5 -mr-1.5 -mt-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors shrink-0">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">${escapeHtml(item.desc)}</p>
        <div class="flex gap-1.5 mb-4 flex-wrap">
          <span class="px-2 py-0.5 text-[10px] font-medium rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">${escapeHtml(item.category)}</span>
          ${(item.tags || []).map(t => `<span class="px-2 py-0.5 text-[10px] font-medium rounded-lg bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
      <div class="px-6 pb-6 space-y-4">
        ${detail.usage ? section('作用', detail.usage) : ''}
        ${detail.example ? codeSection('示例', detail.example) : ''}
        ${detail.notes ? warnSection('注意', detail.notes) : ''}
        ${!detail.usage && !detail.example ? '<div class="text-center py-6"><button id="modal-ask-ai" class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-500/25">问 AI 解释</button></div>' : ''}
      </div>
    </div>
  `

  document.body.appendChild(overlay)
  overlay.querySelector('#modal-close').addEventListener('click', closeModal)

  const askAiBtn = overlay.querySelector('#modal-ask-ai')
  if (askAiBtn) {
    askAiBtn.addEventListener('click', () => {
      closeModal()
      const searchInput = document.getElementById('search-input')
      if (searchInput) {
        searchInput.value = item.cmd
        searchInput.dispatchEvent(new Event('input'))
      }
    })
  }
}

export function closeModal() {
  if (overlay) {
    overlay.style.opacity = '0'
    overlay.style.transition = 'opacity 0.15s'
    setTimeout(() => { overlay?.remove(); overlay = null }, 150)
  }
}

function section(title, content) {
  return `<div><div class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">${title}</div><p class="text-sm leading-relaxed">${escapeHtml(content)}</p></div>`
}

function codeSection(title, code) {
  return `<div><div class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">${title}</div><pre class="text-sm bg-gray-50 dark:bg-white/[0.03] rounded-xl p-3.5 overflow-x-auto font-mono border border-gray-100 dark:border-white/5 leading-relaxed"><code>${escapeHtml(code)}</code></pre></div>`
}

function warnSection(title, content) {
  return `<div class="bg-amber-50/50 dark:bg-amber-500/5 rounded-xl p-3.5 border border-amber-200/50 dark:border-amber-500/10"><div class="text-[10px] font-semibold text-amber-500 uppercase tracking-wider mb-1">${title}</div><p class="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">${escapeHtml(content)}</p></div>`
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
