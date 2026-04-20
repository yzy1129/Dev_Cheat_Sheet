const STORAGE_KEY = 'dev-cheatsheet-fontsize'
const SIZES = [14, 15, 16, 17, 18]
const DEFAULT = 16

export function initFontSize() {
  const saved = parseInt(localStorage.getItem(STORAGE_KEY))
  const size = SIZES.includes(saved) ? saved : DEFAULT
  apply(size)
  return size
}

export function getFontSize() {
  return parseInt(localStorage.getItem(STORAGE_KEY)) || DEFAULT
}

export function setFontSize(size) {
  const clamped = Math.max(SIZES[0], Math.min(SIZES[SIZES.length - 1], size))
  localStorage.setItem(STORAGE_KEY, clamped)
  apply(clamped)
  return clamped
}

export function increaseFontSize() {
  const cur = getFontSize()
  const idx = SIZES.indexOf(cur)
  if (idx < SIZES.length - 1) return setFontSize(SIZES[idx + 1])
  return cur
}

export function decreaseFontSize() {
  const cur = getFontSize()
  const idx = SIZES.indexOf(cur)
  if (idx > 0) return setFontSize(SIZES[idx - 1])
  return cur
}

function apply(size) {
  document.documentElement.style.fontSize = `${size}px`
}
