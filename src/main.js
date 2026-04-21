import './styles/main.css'
import { getState, setState } from './store.js'
import { initRouter, syncURL } from './router.js'
import { loadCheatsheets } from './utils/dataLoader.js'
import { initTheme, toggleTheme } from './utils/theme.js'
import { initShortcuts } from './utils/shortcuts.js'
import { getFavorites, getHistory, addHistory } from './utils/favorites.js'
import {
  applyI18n,
  setLocale,
  t,
  translateCategory,
  translateTag
} from './utils/i18n.js'
import { createCard } from './components/card.js'
import { renderCategories } from './components/category.js'
import { renderTagFilter } from './components/tagFilter.js'
import { initSearch, search } from './components/search.js'
import { closeModal, showModal } from './components/modal.js'
import { matchError, renderErrorCard } from './components/errorLookup.js'
import { debounce } from './utils/debounce.js'
import { initFontSize, increaseFontSize, decreaseFontSize, getFontSize } from './utils/fontSize.js'
import { toggleSidebar, closeSidebar } from './components/sidebar.js'

const searchInput = document.getElementById('search-input')
const cardsContainer = document.getElementById('cards-container')
const emptyState = document.getElementById('empty-state')
const emptyTitle = document.getElementById('empty-title')
const emptySubtitle = document.getElementById('empty-subtitle')
const emptyReset = document.getElementById('empty-reset')
const categoryNav = document.querySelector('#category-nav > div')
const tagNav = document.querySelector('#tag-nav > div')
const sidebarCategories = document.getElementById('sidebar-categories')
const sidebarTags = document.getElementById('sidebar-tags')
const themeToggle = document.getElementById('theme-toggle')
const favoritesToggle = document.getElementById('favorites-toggle')
const aiContainer = document.getElementById('ai-container')
const resultsSummary = document.getElementById('results-summary')
const activeState = document.getElementById('active-state')
const clearFiltersBtn = document.getElementById('clear-filters-btn')
const recentPanel = document.getElementById('recent-panel')
const recentList = document.getElementById('recent-list')
const metricTotalItems = document.getElementById('metric-total-items')
const metricVisibleItems = document.getElementById('metric-visible-items')
const metricGroups = document.getElementById('metric-groups')
const metricFavorites = document.getElementById('metric-favorites')
const metricHistory = document.getElementById('metric-history')
const fontLabel = document.getElementById('font-size-label')
const fontDecrease = document.getElementById('font-decrease')
const fontIncrease = document.getElementById('font-increase')
const sidebarToggle = document.getElementById('sidebar-toggle')
const localeSwitch = document.querySelector('.locale-switch')
const localeZhBtn = document.getElementById('locale-zh')
const localeEnBtn = document.getElementById('locale-en')

initTheme()
initRouter()
initFontSize()

initializeLocale()
updateFontLabel()

if (fontDecrease) {
  fontDecrease.addEventListener('click', () => {
    decreaseFontSize()
    updateFontLabel()
  })
}

if (fontIncrease) {
  fontIncrease.addEventListener('click', () => {
    increaseFontSize()
    updateFontLabel()
  })
}

if (localeZhBtn) localeZhBtn.addEventListener('click', () => switchLocale('zh'))
if (localeEnBtn) localeEnBtn.addEventListener('click', () => switchLocale('en'))

themeToggle.addEventListener('click', toggleTheme)

favoritesToggle.addEventListener('click', () => {
  const s = getState()
  setState({ showFavoritesOnly: !s.showFavoritesOnly })
  syncURL()
  render()
})

if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', clearAllFilters)
if (emptyReset) emptyReset.addEventListener('click', clearAllFilters)

const debouncedRender = debounce(() => {
  setState({ searchQuery: searchInput.value.trim() })
  render()
}, 180)

searchInput.addEventListener('input', debouncedRender)

initShortcuts({
  onSearch: () => searchInput.focus(),
  onEscape: () => clearAllFilters(),
  onHelp: () => import('./components/shortcutHelp.js').then(module => module.showShortcutHelp())
})

if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar)

window.addEventListener('popstate', () => {
  applyLocaleChrome()
  searchInput.value = getState().searchQuery
  render()
})

loadCheatsheets()
  .then(({ groups, flatItems }) => {
    setState({ allData: groups, flatItems })
    initSearch(flatItems)
    const s = getState()
    if (s.searchQuery) searchInput.value = s.searchQuery
    render()
  })
  .catch(error => {
    console.error(error)
    if (resultsSummary) resultsSummary.textContent = t('system.dataLoadFailed')
  })

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}

function initializeLocale() {
  const locale = setLocale(getState().locale)
  setState({ locale })
  applyLocaleChrome()
}

function switchLocale(locale) {
  const nextLocale = setLocale(locale)
  setState({ locale: nextLocale })
  applyLocaleChrome()
  render()
}

function applyLocaleChrome() {
  const locale = getState().locale
  applyI18n(document, locale)

  if (localeSwitch) {
    localeSwitch.setAttribute('aria-label', t('controls.switchLanguage', {}, locale))
    localeSwitch.setAttribute('title', t('controls.switchLanguage', {}, locale))
  }

  if (localeZhBtn) {
    localeZhBtn.classList.toggle('is-active', locale === 'zh')
    localeZhBtn.setAttribute('aria-pressed', String(locale === 'zh'))
    localeZhBtn.setAttribute('title', t('locale.zh', {}, locale))
  }

  if (localeEnBtn) {
    localeEnBtn.classList.toggle('is-active', locale === 'en')
    localeEnBtn.setAttribute('aria-pressed', String(locale === 'en'))
    localeEnBtn.setAttribute('title', t('locale.en', {}, locale))
  }
}

function updateFontLabel() {
  if (fontLabel) fontLabel.textContent = getFontSize()
}

function clearAllFilters() {
  searchInput.value = ''
  setState({
    searchQuery: '',
    activeCategory: null,
    activeTags: [],
    tagLogic: 'OR',
    showFavoritesOnly: false
  })
  closeModal()
  closeSidebar()
  syncURL()
  render()
}

function getCategoryCounts(groups) {
  const counts = {}
  groups.forEach(group => {
    counts[group.category] = (counts[group.category] || 0) + group.items.length
  })
  return counts
}

function getTagCounts(items) {
  const counts = {}
  items.forEach(item => {
    ;(item.tags || []).forEach(tag => {
      counts[tag] = (counts[tag] || 0) + 1
    })
  })
  return counts
}

function renderActiveState(state) {
  if (!activeState) return

  const chips = []

  if (state.searchQuery) chips.push(`${t('state.keyword')}: ${state.searchQuery}`)
  if (state.activeCategory) chips.push(`${t('state.category')}: ${translateCategory(state.activeCategory)}`)
  if (state.activeTags.length) {
    chips.push(
      `${t('state.tags')}: ${state.activeTags.map(tag => translateTag(tag)).join(state.tagLogic === 'AND' ? ' + ' : ' / ')}`
    )
  }
  if (state.showFavoritesOnly) chips.push(t('state.favorites'))

  if (chips.length === 0) {
    activeState.innerHTML = `<span class="state-chip state-chip--muted">${escapeHtml(t('state.none'))}</span>`
    return
  }

  activeState.innerHTML = chips
    .map(text => `<span class="state-chip">${escapeHtml(text)}</span>`)
    .join('')
}

function renderRecent(items) {
  if (!recentPanel || !recentList || !metricHistory) return

  const history = getHistory()
  metricHistory.textContent = String(history.length)

  const byId = new Map(items.map(item => [item.id, item]))
  const recentItems = history
    .map(entry => byId.get(entry.id))
    .filter(Boolean)
    .slice(0, 6)

  recentPanel.classList.toggle('hidden', recentItems.length === 0)

  if (recentItems.length === 0) {
    recentList.innerHTML = ''
    return
  }

  recentList.innerHTML = recentItems
    .map(item => `
      <button class="recent-chip" data-id="${escapeHtml(item.id)}" title="${escapeHtml(item.cmd)}">
        <span class="recent-chip__cmd">${escapeHtml(item.cmd)}</span>
        <span class="recent-chip__desc">${escapeHtml(item.desc)}</span>
      </button>
    `)
    .join('')

  recentList.querySelectorAll('[data-id]').forEach(button => {
    button.addEventListener('click', () => {
      const item = byId.get(button.dataset.id)
      if (!item) return
      addHistory(item.id)
      showModal(item)
      render()
    })
  })
}

function renderDashboard(groups) {
  const s = getState()
  const visibleItems = groups.reduce((sum, group) => sum + group.items.length, 0)
  const totalItems = s.flatItems.length
  const totalGroups = s.allData.length
  const favoritesCount = getFavorites().length

  if (metricTotalItems) metricTotalItems.textContent = String(totalItems)
  if (metricVisibleItems) metricVisibleItems.textContent = String(visibleItems)
  if (metricGroups) metricGroups.textContent = String(totalGroups)
  if (metricFavorites) metricFavorites.textContent = String(favoritesCount)

  if (resultsSummary) {
    if (visibleItems === totalItems && !s.searchQuery && !s.activeCategory && s.activeTags.length === 0 && !s.showFavoritesOnly) {
      resultsSummary.textContent = t('results.full', { totalItems, totalGroups })
    } else {
      resultsSummary.textContent = t('results.filtered', { visibleItems, groups: groups.length })
    }
  }

  if (clearFiltersBtn) {
    const shouldShow = Boolean(s.searchQuery || s.activeCategory || s.activeTags.length || s.showFavoritesOnly)
    clearFiltersBtn.classList.toggle('hidden', !shouldShow)
  }

  favoritesToggle.classList.toggle('is-active', s.showFavoritesOnly)
  renderActiveState(s)
  renderRecent(s.flatItems)
}

function updateEmptyState(groups) {
  const s = getState()
  emptyState.classList.toggle('hidden', groups.length > 0)

  if (groups.length > 0) return

  if (s.searchQuery) {
    emptyTitle.textContent = t('empty.searchTitle', { query: s.searchQuery })
    emptySubtitle.textContent = t('empty.searchDesc')
    return
  }

  if (s.activeCategory || s.activeTags.length || s.showFavoritesOnly) {
    emptyTitle.textContent = t('empty.filteredTitle')
    emptySubtitle.textContent = t('empty.filteredDesc')
    return
  }

  emptyTitle.textContent = t('empty.title')
  emptySubtitle.textContent = t('empty.desc')
}

function renderFilterControls() {
  const s = getState()
  const categories = [...new Set(s.allData.map(group => group.category))]
  const categoryCounts = getCategoryCounts(s.allData)
  const tagCounts = getTagCounts(s.flatItems)

  const selectCategory = (category, closeMobile = false) => {
    setState({ activeCategory: category })
    syncURL()
    if (closeMobile) closeSidebar()
    render()
  }

  const toggleTag = (tag, closeMobile = false) => {
    const nextTags = s.activeTags.includes(tag)
      ? s.activeTags.filter(currentTag => currentTag !== tag)
      : [...s.activeTags, tag]

    setState({ activeTags: nextTags })
    syncURL()
    if (closeMobile) closeSidebar()
    render()
  }

  const toggleLogic = (closeMobile = false) => {
    setState({ tagLogic: s.tagLogic === 'OR' ? 'AND' : 'OR' })
    syncURL()
    if (closeMobile) closeSidebar()
    render()
  }

  if (categoryNav) {
    renderCategories(categoryNav, categories, s.activeCategory, category => selectCategory(category), categoryCounts)
  }

  if (sidebarCategories) {
    renderCategories(sidebarCategories, categories, s.activeCategory, category => selectCategory(category, true), categoryCounts)
  }

  if (tagNav) {
    renderTagFilter(tagNav, s.activeTags, s.tagLogic, tag => toggleTag(tag), () => toggleLogic(), tagCounts)
  }

  if (sidebarTags) {
    renderTagFilter(sidebarTags, s.activeTags, s.tagLogic, tag => toggleTag(tag, true), () => toggleLogic(true), tagCounts)
  }
}

function getVisibleGroups(sourceGroups, state) {
  let groups = sourceGroups

  if (state.searchQuery) {
    const searchResults = search(state.searchQuery)
    if (searchResults) {
      const matchedIds = new Set(searchResults.map(result => result.id))
      groups = groups
        .map(group => ({
          ...group,
          items: group.items.filter(item => matchedIds.has(item.id))
        }))
        .filter(group => group.items.length > 0)
    }
  }

  if (state.activeCategory) {
    groups = groups.filter(group => group.category === state.activeCategory)
  }

  if (state.activeTags.length > 0) {
    groups = groups
      .map(group => ({
        ...group,
        items: group.items.filter(item => {
          if (state.tagLogic === 'AND') return state.activeTags.every(tag => item.tags.includes(tag))
          return state.activeTags.some(tag => item.tags.includes(tag))
        })
      }))
      .filter(group => group.items.length > 0)
  }

  if (state.showFavoritesOnly) {
    const favorites = getFavorites()
    groups = groups
      .map(group => ({
        ...group,
        items: group.items.filter(item => favorites.includes(item.id))
      }))
      .filter(group => group.items.length > 0)
  }

  return groups
}

function render() {
  applyLocaleChrome()

  const state = getState()
  const groups = getVisibleGroups(state.allData, state)
  const query = state.searchQuery

  renderDashboard(groups)
  renderFilterControls()
  updateEmptyState(groups)

  cardsContainer.innerHTML = ''

  if (query) {
    const pendingQuery = query
    matchError(query).then(errors => {
      if (getState().searchQuery !== pendingQuery) return
      errors.forEach(error => renderErrorCard(cardsContainer, error))
    })
  }

  groups.forEach(group => {
    cardsContainer.appendChild(createCard(group, render))
  })

  if (aiContainer) {
    const shouldShowAI = Boolean(query) && groups.length === 0
    aiContainer.classList.toggle('hidden', !shouldShowAI)
    if (shouldShowAI) {
      import('./components/aiResult.js').then(module => module.renderAIPrompt(aiContainer, query))
    }
  }

  syncURL()
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
