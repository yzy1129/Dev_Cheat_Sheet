import Fuse from 'fuse.js'

let fuse = null

export function initSearch(flatItems) {
  fuse = new Fuse(flatItems, {
    keys: [
      { name: 'cmd', weight: 0.32 },
      { name: 'searchDescZh', weight: 0.2 },
      { name: 'searchDescEn', weight: 0.2 },
      { name: 'searchTagsZh', weight: 0.12 },
      { name: 'searchTagsEn', weight: 0.12 },
      { name: 'searchCategoryZh', weight: 0.06 },
      { name: 'searchCategoryEn', weight: 0.08 },
      { name: 'searchGroupTitleZh', weight: 0.06 },
      { name: 'searchGroupTitleEn', weight: 0.08 },
      { name: 'searchGroupContentZh', weight: 0.04 },
      { name: 'searchGroupContentEn', weight: 0.06 },
      { name: 'searchUsageZh', weight: 0.06 },
      { name: 'searchUsageEn', weight: 0.06 },
      { name: 'searchExampleZh', weight: 0.03 },
      { name: 'searchExampleEn', weight: 0.03 },
      { name: 'searchNotesZh', weight: 0.03 },
      { name: 'searchNotesEn', weight: 0.03 }
    ],
    threshold: 0.36,
    includeMatches: true
  })
}

export function search(query) {
  if (!fuse || !query.trim()) return null
  return fuse.search(query).map(r => ({ ...r.item, _matches: r.matches }))
}
