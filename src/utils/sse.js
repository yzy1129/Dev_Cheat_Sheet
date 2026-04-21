function extractEventData(eventText) {
  return eventText
    .split('\n')
    .filter(line => line.startsWith('data:'))
    .map(line => line.slice(5).trimStart())
    .join('')
}

export function consumeSseChunk(buffer, chunk) {
  const combined = `${buffer}${String(chunk || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')}`
  const events = combined.split('\n\n')
  const nextBuffer = events.pop() ?? ''
  const tokens = []
  let done = false

  for (const eventText of events) {
    const data = extractEventData(eventText).trim()

    if (!data) continue
    if (data === '[DONE]') {
      done = true
      break
    }

    try {
      const json = JSON.parse(data)
      const token = json.choices?.[0]?.delta?.content
      if (token) tokens.push(token)
    } catch {
      // Ignore incomplete or malformed SSE payloads.
    }
  }

  return { buffer: nextBuffer, tokens, done }
}
