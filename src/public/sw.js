const CACHE_NAME = "story-app-v1";
const STATIC_CACHE = [
  "/",
  "/index.html",
  "/scripts/index.js",
  "/styles/main.css",
  "/styles/components.css",
  "/styles/pages.css",
  "/styles/layout.css",
  "/styles/responsive.css",
  "/styles/forms.css",
  "/styles/base.css",
  "/styles/transitions.css",
  "/styles/notifications.css",
  "/styles/accessibility.css",
  "/styles/map.css",
  "/styles/camera.css",
  "/favicon.png",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Install event");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching files");
        return cache.addAll(STATIC_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activate event");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Service Worker: Deleting old cache");
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle API requests with NetworkFirst strategy
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Handle static assets with CacheFirst strategy
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          // Return a fallback for other requests
          return new Response('Offline content not available');
        });
    })
  );
});

// Push event - handle incoming push notifications
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push event received");

  let notificationData = {
    title: "Story App",
    options: {
      body: "You have a new notification",
      icon: "/favicon.png",
      badge: "/favicon.png",
      tag: "story-notification",
      data: { url: "/" },
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
          tag: "story-notification",
          renotify: true,
          requireInteraction: true,
          actions: [
            {
              action: "view",
              title: "View Stories",
              icon: "/favicon.png",
            },
            {
              action: "dismiss",
              title: "Dismiss",
            },
          ],
          data: {
            url: pushData.options?.url || "/",
            timestamp: Date.now(),
          },
        },
      };
    }
  } catch (error) {
    console.error("Service Worker: Error parsing push data:", error);
  }

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title,
      notificationData.options
    )
  );
});

// Notification click event - handle user interaction
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification click event");
  event.notification.close();

  if (event.action === "dismiss") {
    return;
  }

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && "focus" in client) {
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
