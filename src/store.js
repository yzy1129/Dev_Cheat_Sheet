const listeners = []

const state = {
  allData: [],
  flatItems: [],
  activeCategory: null,
  activeTags: [],
  tagLogic: 'OR',
  searchQuery: '',
  showFavoritesOnly: false,
  showHistoryOnly: false,
}

export function getState() {
  return state
}

export function setState(patch) {
  Object.assign(state, patch)
  listeners.forEach(fn => fn(state))
}

export function subscribe(fn) {
  listeners.push(fn)
  return () => {
    const idx = listeners.indexOf(fn)
    if (idx > -1) listeners.splice(idx, 1)
  }
}
