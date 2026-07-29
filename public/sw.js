const CACHE_NAME = 'kidtopia-virtual-tour-v2';
const OFFLINE_URL = '/offline.html';

const ASSETS_TO_PRECACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/favicon.ico'
];

// Install event - precache shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_PRECACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - handle dynamic and static assets caching
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // We want to cache virtual tour images, textures, and other assets.
  // This includes images from our app or external sites (pannellum, unsplash, Netlify, raw.githubusercontent, Google Storage, etc.)
  const isImage = request.destination === 'image' || 
                  url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)/i) ||
                  url.hostname.includes('unsplash.com') ||
                  url.hostname.includes('pannellum.org') ||
                  url.hostname.includes('netlify.app') ||
                  url.hostname.includes('githubusercontent.com') ||
                  url.hostname.includes('firebasestorage.googleapis.com');

  if (isImage) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          // Fetch the request from network in the background to update cache (Stale-While-Revalidate)
          const networkFetch = fetch(request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Silence network errors when offline
          });

          // Return cached response if available, otherwise wait for network
          return cachedResponse || networkFetch;
        });
      })
    );
    return;
  }

  // For other static assets (JS, CSS, fonts, local files), use Stale-While-Revalidate
  const isStaticAsset = request.destination === 'script' || 
                        request.destination === 'style' || 
                        request.destination === 'font' ||
                        url.pathname.endsWith('.js') ||
                        url.pathname.endsWith('.css');

  if (isStaticAsset) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const networkFetch = fetch(request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {});
          return cachedResponse || networkFetch;
        });
      })
    );
    return;
  }

  // General request handler (Network first, fall back to offline page for document navigation if offline)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(OFFLINE_URL) || caches.match('/index.html');
      })
    );
  }
});
