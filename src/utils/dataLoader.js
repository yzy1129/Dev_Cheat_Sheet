export async function loadCheatsheets() {
  const res = await fetch('/data/cheatsheets.json')
  if (!res.ok) throw new Error('数据加载失败')
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
      }
      flatItems.push(normalized)
      return normalized
    })
  }
  return { groups, flatItems }
}
