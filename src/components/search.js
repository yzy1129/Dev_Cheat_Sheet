import Fuse from 'fuse.js'

let fuse = null

export function initSearch(flatItems) {
  fuse = new Fuse(flatItems, {
    keys: [
      { name: 'cmd', weight: 0.3 },
      { name: 'desc', weight: 0.25 },
      { name: 'tags', weight: 0.2 },
      { name: 'category', weight: 0.1 },
      { name: 'detail.usage', weight: 0.1 },
      { name: 'detail.example', weight: 0.05 }
    ],
    threshold: 0.4,
    includeMatches: true
  })
}

export function search(query) {
  if (!fuse || !query.trim()) return null
  return fuse.search(query).map(r => ({ ...r.item, _matches: r.matches }))
}
