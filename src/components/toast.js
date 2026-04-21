let container = null

function getContainer() {
  if (!container) {
    container = document.createElement('div')
    container.className = 'fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2'
    document.body.appendChild(container)
  }
  return container
}

export function showToast(message, duration = 1800) {
  const el = document.createElement('div')
  el.className = 'toast-pill toast-enter'
  el.textContent = message
  getContainer().appendChild(el)
  setTimeout(() => {
    el.classList.remove('toast-enter')
    el.classList.add('toast-exit')
    el.addEventListener('animationend', () => el.remove(), { once: true })
  }, duration)
}
