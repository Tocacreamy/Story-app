export default class CacheManager {
  constructor() {
    this.cacheName = 'story-app-v1';
    this.staticCacheName = 'story-app-static-v1';
    this.dynamicCacheName = 'story-app-dynamic-v1';
  }

  async cacheShellResources() {
    const shellResources = [
      '/',
      '/manifest.json',
      '/scripts/index.js',
      '/styles/main.css',
      '/favicon.png',
      '/icons/icon-192x192.png',
      '/icons/icon-512x512.png'
    ];

    try {
      const cache = await caches.open(this.staticCacheName);
      await cache.addAll(shellResources);
      console.log('✅ App shell cached successfully');
    } catch (error) {
      console.error('❌ Failed to cache app shell:', error);
    }
  }

  async cacheStoryData(stories) {
    try {
      const cache = await caches.open(this.dynamicCacheName);
      
      // Cache story data as JSON
      const storiesResponse = new Response(JSON.stringify(stories), {
        headers: { 'Content-Type': 'application/json' }
      });
      
      await cache.put('/api/stories', storiesResponse);
      
      // Cache story images
      for (const story of stories) {
        if (story.photoUrl) {
          try {
            await cache.add(story.photoUrl);
          } catch (imageError) {
            console.warn('Failed to cache image:', story.photoUrl);
          }
        }
      }
      
      console.log('✅ Story data cached successfully');
    } catch (error) {
      console.error('❌ Failed to cache story data:', error);
    }
  }

  async getCachedStories() {
    try {
      const cache = await caches.open(this.dynamicCacheName);
      const response = await cache.match('/api/stories');
      
      if (response) {
        return await response.json();
      }
      
      return null;
    } catch (error) {
      console.error('❌ Failed to get cached stories:', error);
      return null;
    }
  }

  async clearOldCaches() {
    const currentCaches = [
      this.staticCacheName,
      this.dynamicCacheName
    ];

    try {
      const cacheNames = await caches.keys();
      const cachesToDelete = cacheNames.filter(
        cacheName => !currentCaches.includes(cacheName)
      );

      await Promise.all(
        cachesToDelete.map(cacheName => caches.delete(cacheName))
      );

      console.log('✅ Old caches cleared');
    } catch (error) {
      console.error('❌ Failed to clear old caches:', error);
    }
  }
}