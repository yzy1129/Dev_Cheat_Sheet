import { describe, expect, it } from 'vitest'
import {
  mergeCheatsheetDatasets,
  normalizeCheatsheetGroups
} from '../src/utils/cheatsheetData.js'

describe('cheatsheetData', () => {
  it('merges zh/en datasets into one localized structure', () => {
    const zhGroups = [
      {
        id: 'git',
        title: 'Git 常用命令',
        category: 'Git',
        content: '中文内容',
        items: [
          {
            id: 'git-status',
            cmd: 'git status',
            desc: '查看状态',
            tags: ['基础'],
            detail: {
              usage: '查看当前仓库状态',
              example: 'git status',
              notes: '中文备注'
            }
          }
        ]
      }
    ]

    const enGroups = [
      {
        id: 'git',
        title: 'Git Command Cheat Sheet',
        category: 'Git',
        content: 'English content',
        items: [
          {
            id: 'git-status',
            cmd: 'git status',
            desc: 'Check repository status',
            tags: ['Basics'],
            detail: {
              usage: 'Show current repository status',
              example: 'git status',
              notes: 'English note'
            }
          }
        ]
      }
    ]

    const merged = mergeCheatsheetDatasets(zhGroups, enGroups)

    expect(merged[0].i18n.zh.title).toBe('Git 常用命令')
    expect(merged[0].i18n.en.title).toBe('Git Command Cheat Sheet')
    expect(merged[0].items[0].i18n.zh.desc).toBe('查看状态')
    expect(merged[0].items[0].i18n.en.desc).toBe('Check repository status')
    expect(merged[0].items[0].i18n.en.detail.usage).toBe('Show current repository status')
  })

  it('normalizes merged groups into a bilingual search index', () => {
    const groups = normalizeCheatsheetGroups([
      {
        id: 'git',
        title: 'Git 常用命令',
        category: 'Git',
        content: '中文内容',
        items: [
          {
            id: 'git-status',
            cmd: 'git status',
            i18n: {
              zh: {
                desc: '查看状态',
                tags: ['基础'],
                detail: {
                  usage: '查看当前仓库状态',
                  example: 'git status',
                  notes: '中文备注'
                }
              },
              en: {
                desc: 'Check repository status',
                tags: ['Basics'],
                detail: {
                  usage: 'Show current repository status',
                  example: 'git status',
                  notes: 'English note'
                }
              }
            }
          }
        ],
        i18n: {
          zh: { title: 'Git 常用命令', content: '中文内容' },
          en: { title: 'Git Command Cheat Sheet', content: 'English content', category: 'Git' }
        }
      }
    ])

    expect(groups.flatItems).toHaveLength(1)
    expect(groups.flatItems[0].searchDescZh).toBe('查看状态')
    expect(groups.flatItems[0].searchDescEn).toBe('Check repository status')
    expect(groups.flatItems[0].searchGroupTitleEn).toBe('Git Command Cheat Sheet')
    expect(groups.flatItems[0].searchUsageEn).toBe('Show current repository status')
  })
})
