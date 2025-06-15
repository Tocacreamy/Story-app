importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, StaleWhileRevalidate } = workbox.strategies;
const { precacheAndRoute } = workbox.precaching;
const { ExpirationPlugin } = workbox.expiration;
const { CacheableResponsePlugin } = workbox.cacheableResponse;

// Precache static assets
precacheAndRoute([
  { url: '/Story-app/', revision: '1' },
  { url: '/Story-app/index.html', revision: '1' },
  // Perhatian: Jika Vite menghash file JS/CSS, ini akan 404. Workbox sebaiknya menginjeksi secara otomatis.
  // Untuk sementara, kita akan hapus ini jika ini adalah penyebab 404.
  // { url: '/Story-app/scripts/index.js', revision: '1' },
  // { url: '/Story-app/styles/main.css', revision: '1' },
  // { url: '/Story-app/styles/components.css', revision: '1' },
  // { url: '/Story-app/styles/pages.css', revision: '1' },
  // { url: '/Story-app/styles/layout.css', revision: '1' },
  // { url: '/Story-app/styles/responsive.css', revision: '1' },
  // { url: '/Story-app/styles/forms.css', revision: '1' },
  // { url: '/Story-app/styles/base.css', revision: '1' },
  // { url: '/Story-app/styles/transitions.css', revision: '1' },
  // { url: '/Story-app/styles/notifications.css', revision: '1' },
  // { url: '/Story-app/styles/accessibility.css', revision: '1' },
  // { url: '/Story-app/styles/map.css', revision: '1' },
  // { url: '/Story-app/styles/camera.css', revision: '1' },
  { url: '/Story-app/favicon.png', revision: '1' },
  { url: '/Story-app/manifest.json', revision: '1' },
  { url: '/Story-app/icons/icon-192x192.png', revision: '1' },
  { url: '/Story-app/icons/icon-512x512.png', revision: '1' },
  { url: '/Story-app/offline.html', revision: '1' }
]);

// Cache images with a Cache First strategy
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

// Cache CSS, JavaScript, and Web Worker files with a Stale While Revalidate strategy
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Cache API requests with a Network First strategy
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

// Handle navigation requests with a Network First strategy
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Push notification event handler
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push event received');

  let notificationData = {
    title: 'Story App',
    options: {
      body: 'You have a new notification',
      icon: '/Story-app/favicon.png',
      badge: '/Story-app/favicon.png',
      tag: 'story-notification',
      data: { url: '/Story-app/' },
    },
  };

  try {
    if (event.data) {
      const pushData = event.data.json();
      notificationData = {
        title: pushData.title || notificationData.title,
        options: {
          body: pushData.options?.body || notificationData.options.body,
          icon: pushData.options?.icon || notificationData.options.icon,
          badge: pushData.options?.badge || notificationData.options.badge,
          tag: 'story-notification',
          renotify: true,
          requireInteraction: true,
          actions: [
            {
              action: 'view',
              title: 'View Stories',
              icon: '/Story-app/favicon.png',
            },
            {
              action: 'dismiss',
              title: 'Dismiss',
            },
          ],
          data: {
            url: pushData.options?.url || '/Story-app/',
            timestamp: Date.now(),
          },
        },
      };
    }
  } catch (error) {
    console.error('Service Worker: Error parsing push data:', error);
  }

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title,
      notificationData.options
    )
  );
});

// Notification click event handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click event');
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/Story-app/';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }

        // Open new window if app isn't open
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
