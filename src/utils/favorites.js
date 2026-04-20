const STORAGE_KEY = 'dev-cheatsheet-data'

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (Array.isArray(raw)) return { favorites: raw, history: [], pinned: [] }
    return { favorites: [], history: [], pinned: [], ...raw }
  } catch {
    return { favorites: [], history: [], pinned: [] }
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getFavorites() {
  return load().favorites
}

export function toggleFavorite(id) {
  const data = load()
  const idx = data.favorites.indexOf(id)
  if (idx === -1) data.favorites.push(id)
  else data.favorites.splice(idx, 1)
  save(data)
  return data.favorites
}

export function isFavorite(id) {
  return load().favorites.includes(id)
}

export function addHistory(id) {
  const data = load()
  data.history = data.history.filter(h => h.id !== id)
  data.history.unshift({ id, ts: Date.now() })
  if (data.history.length > 50) data.history.length = 50
  save(data)
}

export function getHistory() {
  return load().history
}

export function getPinned() {
  return load().pinned
}

export function togglePin(id) {
  const data = load()
  const idx = data.pinned.indexOf(id)
  if (idx === -1) data.pinned.push(id)
  else data.pinned.splice(idx, 1)
  save(data)
  return data.pinned
}
