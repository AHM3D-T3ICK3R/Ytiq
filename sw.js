// YTIQ Service Worker
// Provides offline functionality and caching for the YTIQ application

const CACHE_NAME = 'ytiq-v1.0.0';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/main.js',
    '/js/auth.js',
    '/js/dashboard.js',
    '/js/analytics.js',
    '/js/keyword-research.js',
    '/js/utils.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('YTIQ Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('YTIQ Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('YTIQ Service Worker: Installation complete');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('YTIQ Service Worker: Installation failed', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('YTIQ Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('YTIQ Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('YTIQ Service Worker: Activation complete');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version if available
                if (response) {
                    return response;
                }

                // Otherwise fetch from network
                return fetch(event.request)
                    .then(response => {
                        // Don't cache if not a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Cache the response for static assets
                        if (event.request.method === 'GET' && 
                            (event.request.url.includes('.css') || 
                             event.request.url.includes('.js') || 
                             event.request.url.includes('.html'))) {
                            
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                        }

                        return response;
                    })
                    .catch(() => {
                        // Return offline fallback for HTML pages
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return new Response(
                                `<!DOCTYPE html>
                                <html>
                                <head>
                                    <title>YTIQ - Offline</title>
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <style>
                                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                                        .offline-message { max-width: 400px; margin: 0 auto; }
                                        .icon { font-size: 64px; color: #ef4444; margin-bottom: 20px; }
                                    </style>
                                </head>
                                <body>
                                    <div class="offline-message">
                                        <div class="icon">📡</div>
                                        <h1>You're Offline</h1>
                                        <p>YTIQ requires an internet connection to load new content.</p>
                                        <p>Please check your connection and try again.</p>
                                        <button onclick="window.location.reload()">Retry</button>
                                    </div>
                                </body>
                                </html>`,
                                {
                                    headers: { 'Content-Type': 'text/html' }
                                }
                            );
                        }
                    });
            })
    );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
    if (event.tag === 'ytiq-sync') {
        console.log('YTIQ Service Worker: Background sync triggered');
        // Handle offline data synchronization here
    }
});

// Push notifications
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        console.log('YTIQ Service Worker: Push notification received', data);
        
        const options = {
            body: data.body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            data: data.url
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.notification.data) {
        event.waitUntil(
            clients.openWindow(event.notification.data)
        );
    }
});

console.log('YTIQ Service Worker: Loaded successfully');