export function initShortcuts({ onSearch, onEscape, onHelp }) {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      if (e.key === 'Escape') {
        e.target.blur()
        onEscape()
      }
      return
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      onSearch()
      return
    }

    switch (e.key) {
      case '/':
        e.preventDefault()
        onSearch()
        break
      case 'Escape':
        onEscape()
        break
      case '?':
        onHelp()
        break
    }
  })
}
