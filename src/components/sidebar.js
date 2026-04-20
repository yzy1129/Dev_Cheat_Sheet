const sidebar = document.getElementById('sidebar')
const overlay = document.getElementById('sidebar-overlay')

export function toggleSidebar() {
  const open = sidebar.classList.contains('translate-x-0')
  if (open) closeSidebar()
  else openSidebar()
}

function openSidebar() {
  sidebar.classList.remove('-translate-x-full')
  sidebar.classList.add('translate-x-0')
  overlay.classList.remove('hidden')
  overlay.addEventListener('click', closeSidebar, { once: true })
}

function closeSidebar() {
  sidebar.classList.add('-translate-x-full')
  sidebar.classList.remove('translate-x-0')
  overlay.classList.add('hidden')
}
