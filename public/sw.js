const CACHE_NAME = 'medireport-v5-cache';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json'
];

// Install: Cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch: Network-first strategy with offline fallback
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;
    // Skip API calls (let them fail gracefully to trigger offline queue in Pinia)
    if (event.request.url.includes('/api/')) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone and cache successful responses
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(event.request).then((cachedResponse) => {
                    return cachedResponse || caches.match('/index.html');
                });
            })
    );
});

// Push Notifications
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: 'MediReport Pro', body: 'Nueva notificación' };
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/medireport-icon-192.png',
            badge: '/medireport-icon-192.png',
            vibrate: [200, 100, 200],
            tag: data.tag || 'default',
            data: { url: data.url || '/' }
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});
