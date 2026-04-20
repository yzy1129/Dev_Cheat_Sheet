import { getState, setState } from './store.js'

export function initRouter() {
  readURL()
  window.addEventListener('popstate', readURL)
}

function readURL() {
  const params = new URLSearchParams(window.location.search)
  const patch = {}
  if (params.has('category')) patch.activeCategory = params.get('category')
  if (params.has('tags')) patch.activeTags = params.get('tags').split(',').filter(Boolean)
  if (params.has('search')) patch.searchQuery = params.get('search')
  if (params.has('logic')) patch.tagLogic = params.get('logic') === 'AND' ? 'AND' : 'OR'
  if (params.has('fav')) patch.showFavoritesOnly = params.get('fav') === '1'
  if (Object.keys(patch).length) setState(patch)
}

export function syncURL() {
  const s = getState()
  const params = new URLSearchParams()
  if (s.activeCategory) params.set('category', s.activeCategory)
  if (s.activeTags.length) params.set('tags', s.activeTags.join(','))
  if (s.searchQuery) params.set('search', s.searchQuery)
  if (s.tagLogic === 'AND') params.set('logic', 'AND')
  if (s.showFavoritesOnly) params.set('fav', '1')
  const qs = params.toString()
  const url = qs ? `?${qs}` : window.location.pathname
  history.replaceState(null, '', url)
}
