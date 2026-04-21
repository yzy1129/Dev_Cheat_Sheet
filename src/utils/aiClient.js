import { getLocale, t } from './i18n.js'

const cache = new Map()

export async function queryAIStream(question, onChunk, onDone, onError) {
  const locale = getLocale()
  const cacheKey = `${locale}::${question}`

  if (cache.has(cacheKey)) {
    onChunk(cache.get(cacheKey))
    onDone()
    return
  }

  let fullText = ''

  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: question, locale })
    })

    if (!res.ok) {
      const err = await res.text().catch(() => t('system.aiUnavailable'))
      onError(new Error(err))
      return
    }

    if (!res.body) {
      onError(new Error(t('system.aiUnavailable')))
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      fullText += chunk
      onChunk(chunk)
    }

    cache.set(cacheKey, fullText)
    onDone()
  } catch (e) {
    onError(e)
  }
}
