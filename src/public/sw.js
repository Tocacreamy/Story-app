importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, StaleWhileRevalidate } = workbox.strategies;
const { precacheAndRoute } = workbox.precaching;
const { ExpirationPlugin } = workbox.expiration;
const { CacheableResponsePlugin } = workbox.cacheableResponse;

// Precache static assets
precacheAndRoute([
  { url: '/', revision: '1' },
  { url: '/index.html', revision: '1' },
  { url: '/scripts/index.js', revision: '1' },
  { url: '/styles/main.css', revision: '1' },
  { url: '/styles/components.css', revision: '1' },
  { url: '/styles/pages.css', revision: '1' },
  { url: '/styles/layout.css', revision: '1' },
  { url: '/styles/responsive.css', revision: '1' },
  { url: '/styles/forms.css', revision: '1' },
  { url: '/styles/base.css', revision: '1' },
  { url: '/styles/transitions.css', revision: '1' },
  { url: '/styles/notifications.css', revision: '1' },
  { url: '/styles/accessibility.css', revision: '1' },
  { url: '/styles/map.css', revision: '1' },
  { url: '/styles/camera.css', revision: '1' },
  { url: '/favicon.png', revision: '1' },
  { url: '/manifest.json', revision: '1' },
  { url: '/icons/icon-192x192.png', revision: '1' },
  { url: '/icons/icon-512x512.png', revision: '1' },
  { url: '/offline.html', revision: '1' }
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
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: 'story-notification',
      data: { url: '/' },
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
              icon: '/favicon.png',
            },
            {
              action: 'dismiss',
              title: 'Dismiss',
            },
          ],
          data: {
            url: pushData.options?.url || '/',
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

  const urlToOpen = event.notification.data?.url || '/';

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
