import { describe, expect, it } from 'vitest'
import { consumeSseChunk } from '../src/utils/sse.js'

describe('consumeSseChunk', () => {
  it('reassembles JSON payloads split across chunks', () => {
    const first = consumeSseChunk('', 'data: {"choices":[{"delta":{"content":"Hel')
    expect(first.tokens).toEqual([])
    expect(first.done).toBe(false)

    const second = consumeSseChunk(
      first.buffer,
      'lo"}}]}\n\ndata: {"choices":[{"delta":{"content":" world"}}]}\n\ndata: [DONE]\n\n'
    )

    expect(second.tokens).toEqual(['Hello', ' world'])
    expect(second.done).toBe(true)
  })

  it('keeps trailing partial data in the buffer', () => {
    const parsed = consumeSseChunk('', 'data: {"choices":[{"delta":{"content":"hello"}}]}\n\ndata: {"choices"')

    expect(parsed.tokens).toEqual(['hello'])
    expect(parsed.done).toBe(false)
    expect(parsed.buffer).toBe('data: {"choices"')
  })
})
