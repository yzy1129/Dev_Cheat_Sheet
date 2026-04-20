import { isFavorite, toggleFavorite, addHistory } from '../utils/favorites.js'
import { copyToClipboard } from '../utils/clipboard.js'
import { showToast } from './toast.js'
import { showModal } from './modal.js'

export function createCard(group, onFavChange) {
  const card = document.createElement('div')
  card.className = 'card-animate bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200/80 dark:border-white/[0.06] overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-300/50 dark:hover:border-indigo-500/20 transition-all duration-300'

  card.innerHTML = `
    <div class="px-5 pt-5 pb-2">
      <div class="flex items-center justify-between gap-3 mb-1.5">
        <h3 class="font-bold text-[0.95rem] leading-snug">${esc(group.title)}</h3>
        <span class="px-2.5 py-0.5 text-[10px] font-medium rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 shrink-0 tracking-wide">${esc(group.category)}</span>
      </div>
      <p class="text-xs text-gray-400 dark:text-gray-500 mb-4">${esc(group.content)}</p>
    </div>
    <div class="px-5 pb-4">
      <div class="cmd-list space-y-0.5 max-h-72 overflow-hidden relative" data-expanded="false"></div>
      <div class="expand-fade absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-[#0c0c14] pointer-events-none hidden"></div>
    </div>
    <button class="expand-btn w-full py-2.5 text-xs font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 bg-gray-50/80 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/[0.04] hover:bg-gray-100/80 dark:hover:bg-white/[0.04] transition-colors hidden">展开全部 ↓</button>
  `

  const cmdList = card.querySelector('.cmd-list')
  const expandBtn = card.querySelector('.expand-btn')
  const expandFade = card.querySelector('.expand-fade')

  group.items.forEach(item => {
    cmdList.appendChild(createItemRow(item, onFavChange))
  })

  requestAnimationFrame(() => {
    if (cmdList.scrollHeight > 288) {
      expandBtn.classList.remove('hidden')
      expandFade.classList.remove('hidden')
    }
  })

  expandBtn.addEventListener('click', () => {
    const expanded = cmdList.dataset.expanded === 'true'
    cmdList.dataset.expanded = String(!expanded)
    cmdList.style.maxHeight = expanded ? '18rem' : 'none'
    expandBtn.textContent = expanded ? '展开全部 ↓' : '收起 ↑'
    expandFade.classList.toggle('hidden', !expanded)
  })

  return card
}

function createItemRow(item, onFavChange) {
  const row = document.createElement('div')
  row.className = 'group/item flex items-center gap-2.5 py-2 px-2.5 -mx-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-all duration-150 cursor-pointer'

  const fav = isFavorite(item.id)
  const tagsHtml = (item.tags || []).slice(0, 2).map(t => {
    const c = tagColors[t] || 'bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-500'
    return `<span class="px-1.5 py-px text-[9px] font-medium rounded-md ${c} leading-none">${esc(t)}</span>`
  }).join('')

  row.innerHTML = `
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <code class="text-[0.8rem] font-semibold text-indigo-600 dark:text-indigo-400 font-mono truncate">${esc(item.cmd)}</code>
        <div class="flex items-center gap-1 shrink-0">${tagsHtml}</div>
      </div>
      <p class="text-[0.7rem] text-gray-400 dark:text-gray-500 mt-0.5 truncate">${esc(item.desc)}</p>
    </div>
    <div class="flex items-center gap-1 shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-150">
      <button class="copy-btn p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-gray-400 hover:text-indigo-500 transition-colors" title="复制">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      </button>
      <button class="fav-btn p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="收藏">
        <svg class="w-3.5 h-3.5 transition-colors ${fav ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}" fill="${fav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
      </button>
    </div>
  `

  row.addEventListener('click', (e) => {
    if (e.target.closest('.copy-btn') || e.target.closest('.fav-btn')) return
    addHistory(item.id)
    showModal(item)
  })

  row.querySelector('.copy-btn').addEventListener('click', (e) => {
    e.stopPropagation()
    const btn = e.currentTarget
    copyToClipboard(item.code || item.cmd)
    addHistory(item.id)
    btn.querySelector('svg').classList.add('text-green-500')
    setTimeout(() => btn.querySelector('svg').classList.remove('text-green-500'), 600)
    showToast('已复制到剪贴板')
  })

  row.querySelector('.fav-btn').addEventListener('click', (e) => {
    e.stopPropagation()
    toggleFavorite(item.id)
    onFavChange()
  })

  return row
}

const tagColors = {
  '基础': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  '进阶': 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  '高频': 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  '面试': 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
  '易错': 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
}

function esc(str) {
  const d = document.createElement('div')
  d.textContent = str || ''
  return d.innerHTML
}
