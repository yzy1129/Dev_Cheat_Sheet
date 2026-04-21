import {
  translateCategory,
  translateGroupContent,
  translateGroupTitle,
  translateTag,
  t
} from './i18n.js'

export async function loadCheatsheets() {
  const res = await fetch('/data/cheatsheets.json')
  if (!res.ok) throw new Error(t('system.dataLoadFailed'))
  const groups = await res.json()
  return normalize(groups)
}

function normalize(groups) {
  const flatItems = []
  for (const group of groups) {
    group.items = (group.items || []).map(item => {
      const normalized = {
        id: item.id || `${group.id}-${item.cmd}`,
        cmd: item.cmd,
        code: item.code || item.cmd,
        desc: item.desc,
        tags: item.tags || [],
        detail: item.detail || null,
        category: group.category,
        groupId: group.id,
        groupTitle: group.title,
        groupContent: group.content,
        searchCategoryEn: translateCategory(group.category, 'en'),
        searchGroupTitleEn: translateGroupTitle(group.id, group.title, 'en'),
        searchGroupContentEn: translateGroupContent(group.id, group.content, 'en'),
        searchTagsEn: (item.tags || []).map(tag => translateTag(tag, 'en'))
      }
      flatItems.push(normalized)
      return normalized
    })
  }
  return { groups, flatItems }
}
