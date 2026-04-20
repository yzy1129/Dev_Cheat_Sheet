let overlay = null

export function showShortcutHelp() {
  if (overlay) return
  overlay = document.createElement('div')
  overlay.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay-enter'
  overlay.style.background = 'rgba(0,0,0,0.4)'
  overlay.style.backdropFilter = 'blur(4px)'
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeHelp() })

  overlay.innerHTML = `
    <div class="modal-content-enter bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-black/20 max-w-xs w-full p-6">
      <h2 class="text-base font-bold mb-4">快捷键</h2>
      <div class="space-y-3 text-sm">
        ${shortcut('/', '聚焦搜索')}
        ${shortcut('Ctrl+K', '全局搜索')}
        ${shortcut('Esc', '清空 / 关闭')}
        ${shortcut('?', '显示帮助')}
      </div>
      <button class="mt-5 w-full py-2.5 bg-gray-100/80 dark:bg-white/5 rounded-xl text-xs font-medium hover:bg-gray-200/80 dark:hover:bg-white/10 transition-colors" id="close-help">关闭</button>
    </div>
  `
  document.body.appendChild(overlay)
  overlay.querySelector('#close-help').addEventListener('click', closeHelp)
}

function closeHelp() {
  if (overlay) {
    overlay.style.opacity = '0'
    overlay.style.transition = 'opacity 0.15s'
    setTimeout(() => { overlay?.remove(); overlay = null }, 150)
  }
}

function shortcut(key, desc) {
  return `<div class="flex items-center justify-between"><span class="text-gray-500 dark:text-gray-400">${desc}</span><kbd class="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded-lg text-[10px] font-mono font-medium text-gray-500 dark:text-gray-400 min-w-[2rem] text-center">${key}</kbd></div>`
}
