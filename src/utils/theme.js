const THEME_KEY = 'dev-cheatsheet-theme'

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY)
  } catch {
    return null
  }
}

export function initTheme() {
  const saved = getStoredTheme()

  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  }
}

export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark')

  try {
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
  } catch {
    // Ignore storage failures in restricted environments.
  }
}
