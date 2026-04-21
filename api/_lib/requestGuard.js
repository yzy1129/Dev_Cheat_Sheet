const RATE_LIMIT_COOKIE = 'dcs_ai_rl'

function encodeBase64Url(input) {
  return btoa(input)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function decodeBase64Url(input) {
  const normalized = input
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(input.length / 4) * 4, '=')

  return atob(normalized)
}

function encodePayload(payload) {
  return encodeBase64Url(JSON.stringify(payload))
}

function decodePayload(payload) {
  try {
    return JSON.parse(decodeBase64Url(payload))
  } catch {
    return null
  }
}

function encodeSignature(bytes) {
  return encodeBase64Url(String.fromCharCode(...bytes))
}

function decodeSignature(signature) {
  return Uint8Array.from(decodeBase64Url(signature), char => char.charCodeAt(0))
}

async function importHmacKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

async function signValue(value, secret) {
  const key = await importHmacKey(secret)
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))
  return encodeSignature(new Uint8Array(signature))
}

async function verifyValue(value, signature, secret) {
  const key = await importHmacKey(secret)
  return crypto.subtle.verify('HMAC', key, decodeSignature(signature), new TextEncoder().encode(value))
}

function extractCookie(cookieHeader, name) {
  return String(cookieHeader || '')
    .split(';')
    .map(part => part.trim())
    .find(part => part.startsWith(`${name}=`))
    ?.slice(name.length + 1) || ''
}

function serializeCookie(value, requestUrl, windowMs) {
  const secure = new URL(requestUrl).protocol === 'https:' ? '; Secure' : ''

  return [
    `${RATE_LIMIT_COOKIE}=${value}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/api/ai',
    `Max-Age=${Math.ceil(windowMs / 1000)}${secure}`
  ].join('; ')
}

async function parseSignedCookie(value, secret) {
  if (!value) return null

  const [payload, signature] = value.split('.')
  if (!payload || !signature) return null

  const valid = await verifyValue(payload, signature, secret)
  if (!valid) return null

  return decodePayload(payload)
}

async function createSignedCookie(payload, secret) {
  const encodedPayload = encodePayload(payload)
  const signature = await signValue(encodedPayload, secret)
  return `${encodedPayload}.${signature}`
}

export function isAllowedRequestOrigin(req) {
  const requestUrl = new URL(req.url)
  const origin = req.headers.get('origin')
  const referer = req.headers.get('referer')
  const fetchSite = req.headers.get('sec-fetch-site')

  if (fetchSite && !['same-origin', 'same-site', 'none'].includes(fetchSite)) {
    return false
  }

  const matchesRequestOrigin = value => {
    if (!value) return false

    try {
      return new URL(value).origin === requestUrl.origin
    } catch {
      return false
    }
  }

  if (origin) return matchesRequestOrigin(origin)
  if (referer) return matchesRequestOrigin(referer)

  return true
}

export async function checkRateLimit(req, {
  secret,
  limit = 6,
  windowMs = 60_000
}) {
  const cookieHeader = req.headers.get('cookie')
  const state = await parseSignedCookie(extractCookie(cookieHeader, RATE_LIMIT_COOKIE), secret)
  const now = Date.now()
  const timestamps = Array.isArray(state?.timestamps)
    ? state.timestamps.filter(timestamp => Number.isFinite(timestamp) && timestamp > now - windowMs)
    : []

  if (timestamps.length >= limit) {
    const retryAfter = Math.max(1, Math.ceil(((timestamps[0] + windowMs) - now) / 1000))
    const signedCookie = await createSignedCookie({ timestamps }, secret)

    return {
      ok: false,
      retryAfter,
      cookieHeader: serializeCookie(signedCookie, req.url, windowMs)
    }
  }

  timestamps.push(now)
  const signedCookie = await createSignedCookie({ timestamps }, secret)

  return {
    ok: true,
    cookieHeader: serializeCookie(signedCookie, req.url, windowMs)
  }
}
