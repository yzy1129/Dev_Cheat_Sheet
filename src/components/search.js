import Fuse from 'fuse.js'

let fuse = null

export function initSearch(flatItems) {
  fuse = new Fuse(flatItems, {
    keys: [
      { name: 'cmd', weight: 0.32 },
      { name: 'desc', weight: 0.24 },
      { name: 'tags', weight: 0.16 },
      { name: 'category', weight: 0.1 },
      { name: 'groupTitle', weight: 0.08 },
      { name: 'groupContent', weight: 0.06 },
      { name: 'searchTagsEn', weight: 0.12 },
      { name: 'searchCategoryEn', weight: 0.08 },
      { name: 'searchGroupTitleEn', weight: 0.08 },
      { name: 'searchGroupContentEn', weight: 0.06 },
      { name: 'detail.usage', weight: 0.1 },
      { name: 'detail.example', weight: 0.05 },
      { name: 'detail.notes', weight: 0.05 }
    ],
    threshold: 0.36,
    includeMatches: true
  })
}

export function search(query) {
  if (!fuse || !query.trim()) return null
  return fuse.search(query).map(r => ({ ...r.item, _matches: r.matches }))
}
