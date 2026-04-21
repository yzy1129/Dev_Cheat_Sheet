import {
  translateCategory,
  translateGroupContent,
  translateGroupTitle,
  translateTag
} from './i18n.js'

function normalizeText(value) {
  return typeof value === 'string' ? value : ''
}

function normalizeDetail(detail = {}) {
  return {
    usage: normalizeText(detail?.usage),
    example: normalizeText(detail?.example),
    notes: normalizeText(detail?.notes)
  }
}

function ensureArray(value) {
  return Array.isArray(value) ? value : []
}

function buildGroupLocale(group) {
  return {
    title: normalizeText(group?.title),
    content: normalizeText(group?.content),
    category: normalizeText(group?.category),
    tags: ensureArray(group?.tags)
  }
}

function buildItemLocale(item) {
  return {
    desc: normalizeText(item?.desc),
    tags: ensureArray(item?.tags),
    detail: normalizeDetail(item?.detail)
  }
}

function assertMatchingItems(groupId, zhItems, enItems) {
  if (zhItems.length !== enItems.length) {
    throw new Error(`Mismatched item count for cheatsheet group "${groupId}"`)
  }
}

export function mergeCheatsheetDatasets(zhGroups, enGroups) {
  const enGroupsById = new Map(ensureArray(enGroups).map(group => [group.id, group]))

  return ensureArray(zhGroups).map(zhGroup => {
    const enGroup = enGroupsById.get(zhGroup.id)

    if (!enGroup) {
      throw new Error(`Missing English cheatsheet group "${zhGroup.id}"`)
    }

    const zhItems = ensureArray(zhGroup.items)
    const enItems = ensureArray(enGroup.items)
    const enItemsById = new Map(enItems.map(item => [item.id, item]))

    assertMatchingItems(zhGroup.id, zhItems, enItems)

    const items = zhItems.map(zhItem => {
      const enItem = enItemsById.get(zhItem.id)

      if (!enItem) {
        throw new Error(`Missing English cheatsheet item "${zhItem.id}" in group "${zhGroup.id}"`)
      }

      return {
        id: zhItem.id || `${zhGroup.id}-${zhItem.cmd}`,
        cmd: zhItem.cmd,
        code: zhItem.code || enItem.code || zhItem.cmd,
        desc: normalizeText(zhItem.desc),
        tags: ensureArray(zhItem.tags),
        detail: normalizeDetail(zhItem.detail),
        category: zhGroup.category,
        groupId: zhGroup.id,
        groupTitle: zhGroup.title,
        groupContent: zhGroup.content,
        i18n: {
          zh: buildItemLocale(zhItem),
          en: {
            ...buildItemLocale(enItem),
            tags: ensureArray(enItem.tags).length
              ? ensureArray(enItem.tags)
              : ensureArray(zhItem.tags).map(tag => translateTag(tag, 'en'))
          }
        }
      }
    })

    return {
      id: zhGroup.id,
      title: normalizeText(zhGroup.title),
      category: normalizeText(zhGroup.category),
      tags: ensureArray(zhGroup.tags),
      content: normalizeText(zhGroup.content),
      items,
      i18n: {
        zh: buildGroupLocale(zhGroup),
        en: {
          ...buildGroupLocale(enGroup),
          title: normalizeText(enGroup.title) || translateGroupTitle(zhGroup.id, zhGroup.title, 'en'),
          content: normalizeText(enGroup.content) || translateGroupContent(zhGroup.id, zhGroup.content, 'en'),
          category: normalizeText(enGroup.category) || translateCategory(zhGroup.category, 'en'),
          tags: ensureArray(enGroup.tags).length
            ? ensureArray(enGroup.tags)
            : ensureArray(zhGroup.tags).map(tag => translateTag(tag, 'en'))
        }
      }
    }
  })
}

export function normalizeCheatsheetGroups(groups) {
  const flatItems = []

  const normalizedGroups = ensureArray(groups).map(group => {
    const normalizedItems = ensureArray(group.items).map(item => {
      const zhLocale = item.i18n?.zh || buildItemLocale(item)
      const enLocale = item.i18n?.en || buildItemLocale(item)
      const normalized = {
        ...item,
        desc: zhLocale.desc,
        tags: zhLocale.tags,
        detail: zhLocale.detail,
        category: group.category,
        groupId: group.id,
        groupTitle: group.title,
        groupContent: group.content,
        searchDescZh: zhLocale.desc,
        searchDescEn: enLocale.desc,
        searchTagsZh: zhLocale.tags,
        searchTagsEn: enLocale.tags,
        searchCategoryZh: group.category,
        searchCategoryEn: group.i18n?.en?.category || translateCategory(group.category, 'en'),
        searchGroupTitleZh: group.i18n?.zh?.title || group.title,
        searchGroupTitleEn: group.i18n?.en?.title || translateGroupTitle(group.id, group.title, 'en'),
        searchGroupContentZh: group.i18n?.zh?.content || group.content,
        searchGroupContentEn: group.i18n?.en?.content || translateGroupContent(group.id, group.content, 'en'),
        searchUsageZh: zhLocale.detail.usage,
        searchUsageEn: enLocale.detail.usage,
        searchExampleZh: zhLocale.detail.example,
        searchExampleEn: enLocale.detail.example,
        searchNotesZh: zhLocale.detail.notes,
        searchNotesEn: enLocale.detail.notes
      }

      flatItems.push(normalized)
      return normalized
    })

    return {
      ...group,
      items: normalizedItems
    }
  })

  return { groups: normalizedGroups, flatItems }
}
