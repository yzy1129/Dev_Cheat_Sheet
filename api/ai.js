import { checkRateLimit, isAllowedRequestOrigin } from './_lib/requestGuard.js'
import { consumeSseChunk } from '../src/utils/sse.js'

export const config = { runtime: 'edge' }

function normalizeLocale(locale) {
  return locale === 'en' ? 'en' : 'zh'
}

function buildPrompt(query, locale) {
  if (locale === 'en') {
    return [
      'You are a senior full-stack engineer.',
      'Answer the following question in concise English.',
      'You may include a short code example when useful.',
      'Keep the answer within 200 words.',
      '',
      `Question: ${query}`
    ].join('\n')
  }

  return [
    '你是一个资深全栈开发工程师，请用中文简洁回答以下问题，可以包含代码示例，不超过200字。',
    '',
    `问题：${query}`
  ].join('\n')
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  if (!isAllowedRequestOrigin(req)) {
    return new Response('Forbidden', { status: 403 })
  }

  let payload

  try {
    payload = await req.json()
  } catch {
    return new Response('Invalid JSON body', { status: 400 })
  }

  const query = String(payload?.query || '').trim()
  const locale = normalizeLocale(payload?.locale)

  if (!query || query.length > 500) {
    return new Response('Invalid query', { status: 400 })
  }

  const apiKey = process.env.DOUBAO_API_KEY
  if (!apiKey) {
    return new Response('AI service not configured', { status: 503 })
  }

  const rateLimit = await checkRateLimit(req, {
    secret: process.env.AI_RATE_LIMIT_SECRET || apiKey
  })

  if (!rateLimit.ok) {
    return new Response('Rate limit exceeded', {
      status: 429,
      headers: {
        'Cache-Control': 'no-store',
        'Retry-After': String(rateLimit.retryAfter),
        'Set-Cookie': rateLimit.cookieHeader
      }
    })
  }

  const prompt = buildPrompt(query, locale)

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
    return new Response(`AI API error: ${err}`, {
      status: 502,
      headers: {
        'Cache-Control': 'no-store',
        'Set-Cookie': rateLimit.cookieHeader
      }
    })
  }

  if (!upstream.body) {
    return new Response('AI API returned an empty stream', {
      status: 502,
      headers: {
        'Cache-Control': 'no-store',
        'Set-Cookie': rateLimit.cookieHeader
      }
    })
  }

  // 将豆包 SSE 流转发给前端，支持跨 chunk 的半包拼接。
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body.getReader()
      const decoder = new TextDecoder()
      const encoder = new TextEncoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const parsed = consumeSseChunk(buffer, chunk)
        buffer = parsed.buffer

        for (const token of parsed.tokens) {
          controller.enqueue(encoder.encode(token))
        }

        if (parsed.done) {
          controller.close()
          return
        }
      }

      if (buffer.trim()) {
        const parsed = consumeSseChunk(buffer, '\n\n')
        for (const token of parsed.tokens) {
          controller.enqueue(encoder.encode(token))
        }
      }

      controller.close()
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
      'Set-Cookie': rateLimit.cookieHeader,
      'Vary': 'Origin, Cookie'
    }
  })
}
