export function renderCategories(container, categories, activeCategory, onSelect) {
  container.innerHTML = ''
  const all = document.createElement('button')
  all.className = getCategoryClass(activeCategory === null)
  all.textContent = '全部'
  all.addEventListener('click', () => onSelect(null))
  container.appendChild(all)

  categories.forEach(cat => {
    const btn = document.createElement('button')
    btn.className = getCategoryClass(activeCategory === cat)
    btn.textContent = cat
    btn.addEventListener('click', () => onSelect(cat))
    container.appendChild(btn)
  })
}

function getCategoryClass(active) {
  const base = 'px-3.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all duration-200'
  return active
    ? `${base} bg-indigo-600 text-white shadow-sm shadow-indigo-500/25`
    : `${base} bg-gray-100/80 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200/80 dark:hover:bg-white/10 hover:text-gray-700 dark:hover:text-gray-200`
}
