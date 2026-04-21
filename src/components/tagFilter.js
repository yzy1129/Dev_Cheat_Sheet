import { t, translateTag } from '../utils/i18n.js'

const ALL_TAGS = ['基础', '进阶', '高频', '面试', '易错']

const tagStyles = {
  '基础': { accent: '#1d8f74' },
  '进阶': { accent: '#2568c7' },
  '高频': { accent: '#d97706' },
  '面试': { accent: '#7c3aed' },
  '易错': { accent: '#dc2626' }
}

export function renderTagFilter(container, activeTags, tagLogic, onTagClick, onLogicToggle, counts = {}) {
  container.innerHTML = ''

  ALL_TAGS.forEach(tag => {
    const btn = document.createElement('button')
    const active = activeTags.includes(tag)
    const accent = tagStyles[tag]?.accent || '#125d73'
    btn.className = active ? 'filter-chip filter-chip--active' : 'filter-chip filter-chip--idle'
    btn.style.setProperty('--chip-accent', accent)
    btn.innerHTML = `
      <span>${translateTag(tag)}</span>
      <span class="${active ? 'filter-chip__count filter-chip__count--active' : 'filter-chip__count'}">${counts[tag] || 0}</span>
    `
    btn.addEventListener('click', () => onTagClick(tag))
    container.appendChild(btn)
  })

  const logicBtn = document.createElement('button')
  logicBtn.className = activeTags.length > 1 ? 'logic-chip' : 'logic-chip logic-chip--muted'
  logicBtn.textContent = tagLogic
  logicBtn.title = tagLogic === 'OR' ? t('filters.logicOrTitle') : t('filters.logicAndTitle')
  logicBtn.disabled = activeTags.length <= 1
  logicBtn.addEventListener('click', onLogicToggle)
  container.appendChild(logicBtn)
}
