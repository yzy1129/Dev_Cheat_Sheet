import { t } from './i18n.js'
import {
  mergeCheatsheetDatasets,
  normalizeCheatsheetGroups
} from './cheatsheetData.js'

export async function loadCheatsheets() {
  const [zhRes, enRes] = await Promise.all([
    fetch('/data/cheatsheets.json'),
    fetch('/data/cheatsheets.en.json')
  ])

  if (!zhRes.ok || !enRes.ok) {
    throw new Error(t('system.dataLoadFailed'))
  }

  const [zhGroups, enGroups] = await Promise.all([
    zhRes.json(),
    enRes.json()
  ])

  return normalizeCheatsheetGroups(mergeCheatsheetDatasets(zhGroups, enGroups))
}
