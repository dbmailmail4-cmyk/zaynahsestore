const CACHE_NAME = 'zaynahs-estore-v2';
const PRECACHE_ASSETS = [
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install: pre-cache static assets (but don't fail if one is missing)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(PRECACHE_ASSETS.map((url) => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

// Activate: remove old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for API/admin, Cache-first for static assets
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Skip non-GET, chrome-extension, and cross-origin requests
  if (
    e.request.method !== 'GET' ||
    !url.protocol.startsWith('http') ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  // Network-first for API routes, admin, and Next.js internals
  const isNetworkFirst =
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.includes('__nextjs');

  if (isNetworkFirst) {
    // Always go to network, don't cache
    e.respondWith(
      fetch(e.request).catch(() => {
        // If network fails, try cache as last resort
        return caches.match(e.request).then((cached) => {
          if (cached) return cached;
          // Return a simple offline response for navigation requests
          if (e.request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Network error', { status: 503 });
        });
      })
    );
    return;
  }

  // Cache-first for static assets (icons, fonts, etc.)
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request)
        .then((response) => {
          // Cache successful responses for static assets
          if (response && response.status === 200 && response.type === 'basic') {
            const toCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, toCache));
          }
          return response;
        })
        .catch(() => {
          // Silently fail — don't throw unhandled rejections
          return new Response('', { status: 503 });
        });
    })
  );
});
