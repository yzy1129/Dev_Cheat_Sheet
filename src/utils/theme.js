const THEME_KEY = 'dev-cheatsheet-theme'

export function initTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  }
}

export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark')
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
}
