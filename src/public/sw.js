const CACHE_NAME = "story-app-v1";
const STATIC_CACHE = [
  "/",
  "/scripts/index.js",
  "/scripts/database.js",
  "/styles/main.css",
  "/favicon.png",
  "/offline.html",
  "/images/offline-image.png"
];

const DYNAMIC_CACHE = "dynamic-cache-v1";

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
            if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
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
          // Clone the response
          const responseClone = response.clone();
          
          // Cache the response
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
          
          return response;
        })
        .catch(() => {
          // Try to get from cache
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
            // Cache dynamic content
            if (request.destination === 'image' || request.destination === 'script' || request.destination === 'style') {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE).then(cache => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // Return offline page for document requests
            if (request.destination === "document") {
              return caches.match("/offline.html");
            }
            // Return fallback for images
            if (request.destination === "image") {
              // Try to get the image from cache first
              return caches.match(request)
                .then(cachedResponse => {
                  if (cachedResponse) {
                    return cachedResponse;
                  }
                  // If not in cache, return offline image
                  return caches.match("/images/offline-image.png");
                });
            }
            // Return empty response for other requests
            return new Response('', {
              status: 404,
              statusText: 'Not Found'
            });
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
