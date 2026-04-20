import './styles/main.css'
import { getState, setState, subscribe } from './store.js'
import { initRouter, syncURL } from './router.js'
import { loadCheatsheets } from './utils/dataLoader.js'
import { initTheme, toggleTheme } from './utils/theme.js'
import { initShortcuts } from './utils/shortcuts.js'
import { getFavorites } from './utils/favorites.js'
import { createCard } from './components/card.js'
import { renderCategories } from './components/category.js'
import { renderTagFilter } from './components/tagFilter.js'
import { initSearch, search } from './components/search.js'
import { closeModal } from './components/modal.js'
import { matchError, renderErrorCard } from './components/errorLookup.js'
import { debounce } from './utils/debounce.js'
import { initFontSize, increaseFontSize, decreaseFontSize, getFontSize } from './utils/fontSize.js'

const searchInput = document.getElementById('search-input')
const cardsContainer = document.getElementById('cards-container')
const emptyState = document.getElementById('empty-state')
const categoryNav = document.querySelector('#category-nav > div')
const tagNav = document.querySelector('#tag-nav > div')
const themeToggle = document.getElementById('theme-toggle')
const favoritesToggle = document.getElementById('favorites-toggle')
const aiContainer = document.getElementById('ai-container')

initTheme()
initRouter()
initFontSize()

const fontLabel = document.getElementById('font-size-label')
const fontDecrease = document.getElementById('font-decrease')
const fontIncrease = document.getElementById('font-increase')

function updateFontLabel() {
  if (fontLabel) fontLabel.textContent = getFontSize()
}
updateFontLabel()

if (fontDecrease) fontDecrease.addEventListener('click', () => { decreaseFontSize(); updateFontLabel() })
if (fontIncrease) fontIncrease.addEventListener('click', () => { increaseFontSize(); updateFontLabel() })

function render() {
  const s = getState()
  let groups = s.allData

  const query = s.searchQuery
  let searchResults = null
  if (query) {
    searchResults = search(query)
  }

  if (searchResults) {
    const matchedIds = new Set(searchResults.map(r => r.id))
    groups = groups.map(g => ({
      ...g,
      items: g.items.filter(i => matchedIds.has(i.id))
    })).filter(g => g.items.length > 0)
  }

  if (s.activeCategory) {
    groups = groups.filter(g => g.category === s.activeCategory)
  }

  if (s.activeTags.length > 0) {
    groups = groups.map(g => ({
      ...g,
      items: g.items.filter(item => {
        if (s.tagLogic === 'AND') return s.activeTags.every(t => item.tags.includes(t))
        return s.activeTags.some(t => item.tags.includes(t))
      })
    })).filter(g => g.items.length > 0)
  }

  if (s.showFavoritesOnly) {
    const favs = getFavorites()
    groups = groups.map(g => ({
      ...g,
      items: g.items.filter(i => favs.includes(i.id))
    })).filter(g => g.items.length > 0)
  }

  cardsContainer.innerHTML = ''
  emptyState.classList.toggle('hidden', groups.length > 0)

  if (query) {
    matchError(query).then(errors => {
      errors.forEach(err => renderErrorCard(cardsContainer, err))
    })
  }

  groups.forEach(group => {
    cardsContainer.appendChild(createCard(group, render))
  })

  const categories = [...new Set(s.allData.map(g => g.category))]
  renderCategories(categoryNav, categories, s.activeCategory, (cat) => {
    setState({ activeCategory: cat })
    syncURL()
    render()
  })

  if (tagNav) {
    renderTagFilter(tagNav, s.activeTags, s.tagLogic,
      (tag) => {
        const tags = s.activeTags.includes(tag)
          ? s.activeTags.filter(t => t !== tag)
          : [...s.activeTags, tag]
        setState({ activeTags: tags })
        syncURL()
        render()
      },
      () => {
        setState({ tagLogic: s.tagLogic === 'OR' ? 'AND' : 'OR' })
        syncURL()
        render()
      }
    )
  }

  favoritesToggle.querySelector('svg').classList.toggle('fill-red-500', s.showFavoritesOnly)
  favoritesToggle.querySelector('svg').classList.toggle('text-red-500', s.showFavoritesOnly)

  if (aiContainer) {
    aiContainer.classList.toggle('hidden', !query || groups.length > 0)
    if (query && groups.length === 0) {
      import('./components/aiResult.js').then(m => m.renderAIPrompt(aiContainer, query))
    }
  }

  syncURL()
}

themeToggle.addEventListener('click', toggleTheme)

favoritesToggle.addEventListener('click', () => {
  const s = getState()
  setState({ showFavoritesOnly: !s.showFavoritesOnly })
  syncURL()
  render()
})

const debouncedRender = debounce(() => {
  setState({ searchQuery: searchInput.value.trim() })
  render()
}, 200)

searchInput.addEventListener('input', debouncedRender)

initShortcuts({
  onSearch: () => searchInput.focus(),
  onEscape: () => {
    searchInput.value = ''
    closeModal()
    setState({ searchQuery: '', activeCategory: null, activeTags: [], showFavoritesOnly: false })
    syncURL()
    render()
  },
  onHelp: () => import('./components/shortcutHelp.js').then(m => m.showShortcutHelp())
})

const sidebarToggle = document.getElementById('sidebar-toggle')
if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    import('./components/sidebar.js').then(m => m.toggleSidebar())
  })
}

loadCheatsheets().then(({ groups, flatItems }) => {
  setState({ allData: groups, flatItems })
  initSearch(flatItems)
  const s = getState()
  if (s.searchQuery) searchInput.value = s.searchQuery
  render()
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}
