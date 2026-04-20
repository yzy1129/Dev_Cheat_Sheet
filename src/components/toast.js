let container = null

function getContainer() {
  if (!container) {
    container = document.createElement('div')
    container.className = 'fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2'
    document.body.appendChild(container)
  }
  return container
}

export function showToast(message, duration = 2000) {
  const el = document.createElement('div')
  el.className = 'toast-enter px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-xl shadow-lg shadow-black/10'
  el.textContent = message
  getContainer().appendChild(el)
  setTimeout(() => {
    el.classList.remove('toast-enter')
    el.classList.add('toast-exit')
    el.addEventListener('animationend', () => el.remove())
  }, duration)
}
