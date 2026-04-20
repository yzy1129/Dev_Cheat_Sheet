const ALL_TAGS = ['基础', '进阶', '高频', '面试', '易错']

const tagStyles = {
  '基础': { active: 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/25', idle: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20' },
  '进阶': { active: 'bg-blue-500 text-white shadow-sm shadow-blue-500/25', idle: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20' },
  '高频': { active: 'bg-amber-500 text-white shadow-sm shadow-amber-500/25', idle: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20' },
  '面试': { active: 'bg-violet-500 text-white shadow-sm shadow-violet-500/25', idle: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-500/20' },
  '易错': { active: 'bg-rose-500 text-white shadow-sm shadow-rose-500/25', idle: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20' },
}

export function renderTagFilter(container, activeTags, tagLogic, onTagClick, onLogicToggle) {
  container.innerHTML = ''

  ALL_TAGS.forEach(tag => {
    const btn = document.createElement('button')
    const active = activeTags.includes(tag)
    const style = tagStyles[tag] || tagStyles['基础']
    btn.className = `px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all duration-200 ${active ? style.active : style.idle}`
    btn.textContent = tag
    btn.addEventListener('click', () => onTagClick(tag))
    container.appendChild(btn)
  })

  if (activeTags.length > 1) {
    const logicBtn = document.createElement('button')
    logicBtn.className = 'px-2.5 py-1.5 text-[10px] font-bold rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ml-0.5 tabular-nums'
    logicBtn.textContent = tagLogic
    logicBtn.title = tagLogic === 'OR' ? '包含任一标签' : '包含所有标签'
    logicBtn.addEventListener('click', onLogicToggle)
    container.appendChild(logicBtn)
  }
}
