const CACHE_VERSION = "v1";
const STATIC_CACHE = `story-app-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `story-app-dynamic-${CACHE_VERSION}`;
const OFFLINE_CACHE = `story-app-offline-${CACHE_VERSION}`;

// App Shell resources
const STATIC_RESOURCES = [
  "/",
  "/manifest.json",
  "/scripts/index.js",
  "/styles/main.css",
  "/favicon.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/scripts/app-shell/AppShell.js",
  "/scripts/app-shell/Header.js",
  "/scripts/app-shell/Navigation.js",
  "/scripts/app-shell/Footer.js",
];

// Network-first resources (API endpoints)
const NETWORK_FIRST = ["/api/", "https://story-api.dicoding.dev/v1/"];

// Cache-first resources (images, fonts)
const CACHE_FIRST = [
  "/icons/",
  "/images/",
  "https://fonts.googleapis.com/",
  "https://fonts.gstatic.com/",
];

// Install event - cache app shell
self.addEventListener("install", (event) => {
  console.log("🔧 Service Worker: Install event");

  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("📦 Caching app shell");
        return cache.addAll(STATIC_RESOURCES);
      }),
      // Create offline page cache
      caches.open(OFFLINE_CACHE).then((cache) => {
        return cache.add("/offline.html");
      }),
    ]).then(() => {
      console.log("✅ App shell cached successfully");
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker: Activate event");

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, OFFLINE_CACHE];
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              console.log("🗑️ Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages
      self.clients.claim(),
    ]).then(() => {
      console.log("✅ Service Worker activated and ready");
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith("http")) {
    return;
  }

  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);

  try {
    // 1. App Shell - Cache First (with network fallback)
    if (STATIC_RESOURCES.includes(url.pathname) || url.pathname === "/") {
      return await cacheFirst(request, STATIC_CACHE);
    }

    // 2. API Calls - Network First (with cache fallback)
    if (NETWORK_FIRST.some((pattern) => url.href.includes(pattern))) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }

    // 3. Images, Fonts - Cache First
    if (CACHE_FIRST.some((pattern) => url.href.includes(pattern))) {
      return await cacheFirst(request, DYNAMIC_CACHE);
    }

    // 4. Other resources - Network First
    return await networkFirst(request, DYNAMIC_CACHE);
  } catch (error) {
    console.error("❌ Fetch error:", error);

    // Return offline page for navigation requests
    if (request.destination === "document") {
      return await caches.match("/offline.html");
    }

    // Return cached version or throw error
    return (await caches.match(request)) || Response.error();
  }
}

// Cache First Strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn("Network request failed:", request.url);
    throw error;
  }
}

// Network First Strategy
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn("Network request failed, trying cache:", request.url);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Push notification handling (your existing code)
self.addEventListener("push", (event) => {
  console.log("🔔 Service Worker: Push event received");

  let notificationData = {
    title: "Story App",
    options: {
      body: "You have a new notification",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      tag: "story-notification",
      data: { url: "/" },
      actions: [
        {
          action: "view",
          title: "View Stories",
          icon: "/icons/icon-192x192.png",
        },
        {
          action: "dismiss",
          title: "Dismiss",
        },
      ],
    },
  };

  try {
    if (event.data) {
      const pushData = event.data.json();
      notificationData = {
        title: pushData.title || notificationData.title,
        options: {
          ...notificationData.options,
          body: pushData.options?.body || notificationData.options.body,
          icon: pushData.options?.icon || notificationData.options.icon,
          data: {
            url: pushData.options?.url || "/",
            timestamp: Date.now(),
          },
        },
      };
    }
  } catch (error) {
    console.error("❌ Error parsing push data:", error);
  }

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title,
      notificationData.options
    )
  );
});

// Notification click handling (your existing code)
self.addEventListener("notificationclick", (event) => {
  console.log("👆 Service Worker: Notification click event");
  event.notification.close();

  if (event.action === "dismiss") {
    return;
  }

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("🔄 Service Worker: Background sync event", event.tag);

  if (event.tag === "background-sync") {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  console.log("🔄 Performing background sync...");

  try {
    // Here you would sync any pending uploads, etc.
    // For now, we'll just log that sync is happening
    console.log("✅ Background sync completed");
  } catch (error) {
    console.error("❌ Background sync failed:", error);
  }
}
