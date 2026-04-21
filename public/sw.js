const VERSION = 'v2026-04-21'
const APP_CACHE = `devcheat-app-${VERSION}`
const DATA_CACHE = `devcheat-data-${VERSION}`
const RUNTIME_CACHE = `devcheat-runtime-${VERSION}`

const APP_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/404.html',
  '/manifest.json',
  '/favicon.svg'
]

const DATA_ASSETS = [
  '/data/cheatsheets.json',
  '/data/cheatsheets.en.json',
  '/data/errors.json',
  '/data/errors.en.json'
]

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(APP_CACHE).then(cache => cache.addAll(APP_SHELL_ASSETS)),
      caches.open(DATA_CACHE).then(cache => cache.addAll(DATA_ASSETS))
    ])
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  const activeCaches = new Set([APP_CACHE, DATA_CACHE, RUNTIME_CACHE])

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => !activeCaches.has(key))
          .map(key => caches.delete(key))
      )
    )
  )

  self.clients.claim()
})

self.addEventListener('fetch', event => {
  const { request } = event

  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/')) return

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, APP_CACHE, '/index.html'))
    return
  }

  if (url.pathname.startsWith('/data/')) {
    event.respondWith(networkFirst(request, DATA_CACHE))
    return
  }

  if (isStaticAsset(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE))
    return
  }

  event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE))
})

function isStaticAsset(pathname) {
  return /\.(?:js|css|png|jpg|jpeg|gif|svg|webp|ico|woff2?)$/i.test(pathname)
}

async function networkFirst(request, cacheName, fallbackPath = null) {
  const cache = await caches.open(cacheName)

  try {
    const response = await fetch(request)

    if (isCacheable(response)) {
      await cache.put(request, response.clone())
    }

    return response
  } catch {
    const cached = await cache.match(request)
    if (cached) return cached

    if (fallbackPath) {
      const fallback = await cache.match(fallbackPath)
      if (fallback) return fallback
    }

    return Response.error()
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  const networkPromise = fetch(request)
    .then(async response => {
      if (isCacheable(response)) {
        await cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => cached)

  return cached || networkPromise
}

function isCacheable(response) {
  return Boolean(response && response.ok && response.type !== 'opaque')
}
