import { t } from './i18n.js'

const cache = new Map()

export async function queryAIStream(question, onChunk, onDone, onError) {
  if (cache.has(question)) {
    onChunk(cache.get(question))
    onDone()
    return
  }

  let fullText = ''

  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: question })
    })

    if (!res.ok) {
      const err = await res.text().catch(() => t('system.aiUnavailable'))
      onError(new Error(err))
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

    cache.set(question, fullText)
    onDone()
  } catch (e) {
    onError(e)
  }
}
