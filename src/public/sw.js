importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, StaleWhileRevalidate } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { CacheableResponsePlugin } = workbox.cacheableResponse;

const CACHE_NAME = "story-app-v1";
const BASE_URL = '/Story-app/PWA-feature/'; // Sesuaikan dengan nama repo dan branch

const STATIC_CACHE = [
  BASE_URL,
  `${BASE_URL}scripts/index.js`,
  `${BASE_URL}scripts/database.js`,
  `${BASE_URL}styles/main.css`,
  `${BASE_URL}favicon.png`,
  `${BASE_URL}offline.html`,
  `${BASE_URL}images/offline-image.png`
];

// Precaching
workbox.precaching.precacheAndRoute([
  { url: '/', revision: '1' },
  { url: '/offline.html', revision: '1' },
  { url: '/styles/main.css', revision: '1' },
  { url: '/scripts/index.js', revision: '1' },
  { url: '/scripts/database.js', revision: '1' },
  { url: '/favicon.png', revision: '1' },
  { url: '/images/offline-image.png', revision: '1' }
]);

// Cache images with CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
      })
    ]
  })
);

// Cache API requests with NetworkFirst strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60 // 5 minutes
      })
    ]
  })
);

// Cache static assets with StaleWhileRevalidate
registerRoute(
  ({ request }) => 
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Handle offline fallback
workbox.routing.setCatchHandler(async ({ request }) => {
  if (request.destination === 'document') {
    return caches.match('/offline.html');
  }
  if (request.destination === 'image') {
    return caches.match('/images/offline-image.png');
  }
  return Response.error();
});

// Background sync for failed requests
const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin('storyQueue', {
  maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
});

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    plugins: [bgSyncPlugin]
  }),
  'POST'
);

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Story',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Story App', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Update fetch event handler
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Ignore chrome-extension requests
  if (request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Handle API requests
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Handle other requests
  event.respondWith(
    caches
      .match(request)
      .then((response) => {
        return response || fetch(request)
          .then(response => {
            if (request.destination === 'image' || request.destination === 'script' || request.destination === 'style') {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE).then(cache => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            if (request.destination === "document") {
              return caches.match(`${BASE_URL}offline.html`);
            }
            if (request.destination === "image") {
              return caches.match(`${BASE_URL}images/offline-image.png`);
            }
            return new Response('', {
              status: 404,
              statusText: 'Not Found'
            });
          });
      })
  );
});
