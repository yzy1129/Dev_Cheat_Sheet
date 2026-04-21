import { isFavorite, toggleFavorite, addHistory } from '../utils/favorites.js'
import { copyToClipboard } from '../utils/clipboard.js'
import {
  t,
  translateCategory,
  translateGroupContent,
  translateGroupTitle,
  translateTag
} from '../utils/i18n.js'
import { showToast } from './toast.js'
import { showModal } from './modal.js'

export function createCard(group, onFavChange) {
  const card = document.createElement('div')
  const tone = groupTones[group.category] || groupTones.default
  const title = translateGroupTitle(group.id, group.title)
  const content = translateGroupContent(group.id, group.content)
  const category = translateCategory(group.category)

  card.className = 'cheat-card card-animate'
  card.style.setProperty('--card-accent', tone.accent)
  card.style.setProperty('--card-accent-soft', tone.soft)
  card.style.setProperty('--card-glow', tone.glow)

  card.innerHTML = `
    <div class="cheat-card__bar"></div>
    <div class="cheat-card__inner">
      <div class="cheat-card__head">
        <div class="min-w-0">
          <p class="cheat-card__eyebrow">${esc(t('card.eyebrow'))}</p>
          <h3 class="cheat-card__title">${esc(title)}</h3>
          <p class="cheat-card__desc">${esc(content)}</p>
        </div>
        <div class="cheat-card__badges">
          <span class="cheat-card__category">${esc(category)}</span>
          <span class="cheat-card__count">${esc(t('card.itemCount', { count: group.items.length }))}</span>
        </div>
      </div>
      <div class="relative">
        <div class="cmd-list space-y-1 max-h-80 overflow-hidden" data-expanded="false"></div>
        <div class="expand-fade hidden"></div>
      </div>
    </div>
    <button class="expand-btn hidden">${esc(t('card.expand'))}</button>
  `

  const cmdList = card.querySelector('.cmd-list')
  const expandBtn = card.querySelector('.expand-btn')
  const expandFade = card.querySelector('.expand-fade')

  group.items.forEach(item => {
    cmdList.appendChild(createItemRow(item, onFavChange))
  })

  requestAnimationFrame(() => {
    if (cmdList.scrollHeight > 320) {
      expandBtn.classList.remove('hidden')
      expandFade.classList.remove('hidden')
    }
  })

  expandBtn.addEventListener('click', () => {
    const expanded = cmdList.dataset.expanded === 'true'
    cmdList.dataset.expanded = String(!expanded)
    cmdList.style.maxHeight = expanded ? '20rem' : 'none'
    expandBtn.textContent = expanded ? t('card.expand') : t('card.collapse')
    expandFade.classList.toggle('hidden', !expanded)
  })

  return card
}

function createItemRow(item, onFavChange) {
  const row = document.createElement('div')
  row.className = 'command-row group/item'

  const fav = isFavorite(item.id)
  const tagsHtml = (item.tags || []).slice(0, 2).map(tag => {
    const color = tagColors[tag] || 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400'
    return `<span class="command-row__tag ${color}">${esc(translateTag(tag))}</span>`
  }).join('')

  row.innerHTML = `
    <div class="command-row__body">
      <div class="command-row__top">
        <code class="command-row__cmd">${esc(item.cmd)}</code>
        <div class="flex items-center gap-1.5 shrink-0">${tagsHtml}</div>
      </div>
      <p class="command-row__desc">${esc(item.desc)}</p>
    </div>
    <div class="command-row__actions md:opacity-0 md:group-hover/item:opacity-100">
      <button class="row-action copy-btn" title="${esc(t('card.copy'))}" aria-label="${esc(t('card.copy'))}">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      </button>
      <button class="row-action row-action--fav fav-btn" title="${esc(t('card.favorite'))}" aria-label="${esc(t('card.favorite'))}">
        <svg class="w-3.5 h-3.5 transition-colors ${fav ? 'fill-rose-500 text-rose-500' : 'text-[var(--muted-2)] hover:text-rose-400'}" fill="${fav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
      </button>
    </div>
  `

  row.addEventListener('click', event => {
    if (event.target.closest('.copy-btn') || event.target.closest('.fav-btn')) return
    addHistory(item.id)
    showModal(item)
  })

  row.querySelector('.copy-btn').addEventListener('click', event => {
    event.stopPropagation()
    const btn = event.currentTarget
    copyToClipboard(item.code || item.cmd)
    addHistory(item.id)
    btn.querySelector('svg').classList.add('text-emerald-500')
    setTimeout(() => btn.querySelector('svg').classList.remove('text-emerald-500'), 700)
    showToast(t('card.copied'))
  })

  row.querySelector('.fav-btn').addEventListener('click', event => {
    event.stopPropagation()
    toggleFavorite(item.id)
    onFavChange()
  })

  return row
}

const groupTones = {
  'Git': { accent: '#c2410c', soft: 'rgba(194,65,12,0.12)', glow: 'rgba(194,65,12,0.18)' },
  'Node.js': { accent: '#0f766e', soft: 'rgba(15,118,110,0.12)', glow: 'rgba(15,118,110,0.18)' },
  'JavaScript': { accent: '#b45309', soft: 'rgba(180,83,9,0.12)', glow: 'rgba(180,83,9,0.18)' },
  'CSS': { accent: '#2563eb', soft: 'rgba(37,99,235,0.12)', glow: 'rgba(37,99,235,0.18)' },
  '终端': { accent: '#047857', soft: 'rgba(4,120,87,0.12)', glow: 'rgba(4,120,87,0.18)' },
  'Windows': { accent: '#0f5ed7', soft: 'rgba(15,94,215,0.12)', glow: 'rgba(15,94,215,0.18)' },
  'macOS': { accent: '#0f766e', soft: 'rgba(15,118,110,0.12)', glow: 'rgba(15,118,110,0.18)' },
  '系统': { accent: '#475569', soft: 'rgba(71,85,105,0.12)', glow: 'rgba(71,85,105,0.18)' },
  '容器': { accent: '#0ea5e9', soft: 'rgba(14,165,233,0.12)', glow: 'rgba(14,165,233,0.18)' },
  '数据库': { accent: '#0f766e', soft: 'rgba(15,118,110,0.12)', glow: 'rgba(15,118,110,0.18)' },
  '测试': { accent: '#e11d48', soft: 'rgba(225,29,72,0.12)', glow: 'rgba(225,29,72,0.18)' },
  '云': { accent: '#0284c7', soft: 'rgba(2,132,199,0.12)', glow: 'rgba(2,132,199,0.18)' },
  'Python': { accent: '#2563eb', soft: 'rgba(37,99,235,0.12)', glow: 'rgba(37,99,235,0.18)' },
  'Java': { accent: '#b45309', soft: 'rgba(180,83,9,0.12)', glow: 'rgba(180,83,9,0.18)' },
  'Go': { accent: '#0891b2', soft: 'rgba(8,145,178,0.12)', glow: 'rgba(8,145,178,0.18)' },
  'Rust': { accent: '#92400e', soft: 'rgba(146,64,14,0.12)', glow: 'rgba(146,64,14,0.18)' },
  'C/C++': { accent: '#4f46e5', soft: 'rgba(79,70,229,0.12)', glow: 'rgba(79,70,229,0.18)' },
  '.NET': { accent: '#7c3aed', soft: 'rgba(124,58,237,0.12)', glow: 'rgba(124,58,237,0.18)' },
  'PHP': { accent: '#4338ca', soft: 'rgba(67,56,202,0.12)', glow: 'rgba(67,56,202,0.18)' },
  'Ruby': { accent: '#be123c', soft: 'rgba(190,18,60,0.12)', glow: 'rgba(190,18,60,0.18)' },
  '前端': { accent: '#c2410c', soft: 'rgba(194,65,12,0.12)', glow: 'rgba(194,65,12,0.18)' },
  '协作': { accent: '#6d28d9', soft: 'rgba(109,40,217,0.12)', glow: 'rgba(109,40,217,0.18)' },
  '移动': { accent: '#db2777', soft: 'rgba(219,39,119,0.12)', glow: 'rgba(219,39,119,0.18)' },
  '工具': { accent: '#7c3aed', soft: 'rgba(124,58,237,0.12)', glow: 'rgba(124,58,237,0.18)' },
  default: { accent: '#125d73', soft: 'rgba(18,93,115,0.12)', glow: 'rgba(18,93,115,0.18)' }
}

const tagColors = {
  '基础': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  '进阶': 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  '高频': 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  '面试': 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300',
  '易错': 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
}

function esc(str) {
  const div = document.createElement('div')
  div.textContent = str || ''
  return div.innerHTML
}
