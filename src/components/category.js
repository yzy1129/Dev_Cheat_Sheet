import { t, translateCategory } from '../utils/i18n.js'

export function renderCategories(container, categories, activeCategory, onSelect, counts = {}) {
  container.innerHTML = ''

  container.appendChild(
    createCategoryButton(
      t('filters.all'),
      null,
      activeCategory === null,
      onSelect,
      Object.values(counts).reduce((sum, count) => sum + count, 0)
    )
  )

  categories.forEach(category => {
    container.appendChild(
      createCategoryButton(
        translateCategory(category),
        category,
        activeCategory === category,
        onSelect,
        counts[category] || 0
      )
    )
  })
}

function createCategoryButton(label, value, active, onSelect, count) {
  const btn = document.createElement('button')
  btn.className = getCategoryClass(active)
  btn.innerHTML = `
    <span>${label}</span>
    <span class="${active ? 'filter-chip__count filter-chip__count--active' : 'filter-chip__count'}">${count}</span>
  `
  btn.addEventListener('click', () => onSelect(value))
  return btn
}

function getCategoryClass(active) {
  const base = 'filter-chip'
  return active ? `${base} filter-chip--active` : `${base} filter-chip--idle`
}
