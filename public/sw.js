
const CACHE_NAME = 'fsr-v2';
const STATIC_CACHE = 'fsr-static-v2';
const IMAGE_CACHE = 'fsr-images-v2';

// Cache durations (in milliseconds)
const CACHE_DURATION = {
  STATIC_ASSETS: 365 * 24 * 60 * 60 * 1000, // 1 year for JS/CSS with hashes
  IMAGES: 30 * 24 * 60 * 60 * 1000, // 30 days for images
  HTML: 24 * 60 * 60 * 1000, // 1 day for HTML
};

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME),
      caches.open(STATIC_CACHE),
      caches.open(IMAGE_CACHE)
    ]).then(() => {
      console.log('Service worker installed with enhanced caching');
      self.skipWaiting();
    })
  );
});

// Fetch event with smart caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Static assets (JS, CSS with hashes) - Cache first, long cache
  if (url.pathname.match(/\.(js|css)$/) && url.pathname.includes('-')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(cache => {
        return cache.match(request).then(response => {
          if (response) {
            // Check if cache is still valid
            const dateHeader = response.headers.get('date');
            const cacheTime = dateHeader ? new Date(dateHeader).getTime() : 0;
            const now = Date.now();
            
            if (now - cacheTime < CACHE_DURATION.STATIC_ASSETS) {
              return response;
            }
          }
          
          // Fetch and cache
          return fetch(request).then(fetchResponse => {
            if (fetchResponse.ok) {
              const responseClone = fetchResponse.clone();
              cache.put(request, responseClone);
            }
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // Images - Stale while revalidate with extended cache
  if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(cache => {
        return cache.match(request).then(response => {
          const fetchPromise = fetch(request).then(fetchResponse => {
            if (fetchResponse.ok) {
              cache.put(request, fetchResponse.clone());
            }
            return fetchResponse;
          });

          // Return cached version immediately if available, update in background
          return response || fetchPromise;
        });
      })
    );
    return;
  }

  // HTML pages - Network first with short cache fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Default: try cache first, then network
  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request);
    })
  );
});

// Activate event with cleanup
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.startsWith('fsr-') || 
              !['fsr-v2', 'fsr-static-v2', 'fsr-images-v2'].includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service worker activated with enhanced caching');
      return self.clients.claim();
    })
  );
});
