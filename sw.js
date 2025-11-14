
const CACHE_NAME = 'rekod-kuliah-cache-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/index.tsx',
    '/App.tsx',
    '/types.ts',
    '/hooks/useLocalStorage.ts',
    '/components/icons.tsx',
    '/components/LectureForm.tsx',
    '/components/LectureCard.tsx',
    '/components/CalendarView.tsx',
    '/components/MapView.tsx',
    '/components/ConfirmationModal.tsx',
    '/components/LocationPickerModal.tsx'
];

// Precache static assets on install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Precaching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Clean up old caches on activation
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Serve from cache, fallback to network, then cache the new resource
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }

    // Special handling for Leaflet tiles to avoid caching them
    if (event.request.url.includes('tile.openstreetmap.org') || event.request.url.includes('basemaps.cartocdn.com')) {
        return; // Let the browser handle the request, don't cache
    }

    event.respondWith(
        caches.open(CACHE_NAME).then(async cache => {
            const cachedResponse = await cache.match(event.request);
            
            const fetchPromise = fetch(event.request).then(networkResponse => {
                // Check if we received a valid response
                if (networkResponse && networkResponse.status === 200) {
                     cache.put(event.request, networkResponse.clone());
                }
                return networkResponse;
            }).catch(err => {
                console.error('Fetch failed; returning offline page instead.', err);
            });

            return cachedResponse || fetchPromise;
        })
    );
});
