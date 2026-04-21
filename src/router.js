import { getState, setState } from './store.js'
import { DEFAULT_LOCALE, normalizeLocale } from './utils/i18n.js'

export function initRouter() {
  readURL()
  window.addEventListener('popstate', readURL)
}

function readURL() {
  const params = new URLSearchParams(window.location.search)
  const current = getState()

  setState({
    activeCategory: params.get('category') || null,
    activeTags: (params.get('tags') || '').split(',').filter(Boolean),
    searchQuery: params.get('search') || '',
    tagLogic: params.get('logic') === 'AND' ? 'AND' : 'OR',
    showFavoritesOnly: params.get('fav') === '1',
    locale: normalizeLocale(params.get('lang') || current.locale)
  })
}

export function syncURL() {
  const s = getState()
  const params = new URLSearchParams()
  if (s.activeCategory) params.set('category', s.activeCategory)
  if (s.activeTags.length) params.set('tags', s.activeTags.join(','))
  if (s.searchQuery) params.set('search', s.searchQuery)
  if (s.tagLogic === 'AND') params.set('logic', 'AND')
  if (s.showFavoritesOnly) params.set('fav', '1')
  if (s.locale && s.locale !== DEFAULT_LOCALE) params.set('lang', s.locale)
  const qs = params.toString()
  const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
  history.replaceState(null, '', url)
}
