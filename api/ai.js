export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { query } = await req.json()
  if (!query || typeof query !== 'string' || query.length > 500) {
    return new Response('Invalid query', { status: 400 })
  }

  const apiKey = process.env.DOUBAO_API_KEY
  if (!apiKey) {
    return new Response('AI service not configured', { status: 503 })
  }

  const prompt = `你是一个资深全栈开发工程师，请用中文简洁回答以下问题，可以包含代码示例，不超过200字。

问题：${query}`

  const upstream = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'doubao-seed-2-0-pro-260215',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1024,
      stream: true
    })
  })

  if (!upstream.ok) {
    const err = await upstream.text()
    return new Response(`AI API error: ${err}`, { status: 502 })
  }

  // 将豆包 SSE 流转发给前端
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') {
            controller.close()
            return
          }
          try {
            const json = JSON.parse(data)
            const token = json.choices?.[0]?.delta?.content
            if (token) {
              controller.enqueue(new TextEncoder().encode(token))
            }
          } catch {
            // 忽略解析失败的行
          }
        }
      }
      controller.close()
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache'
    }
  })
}
