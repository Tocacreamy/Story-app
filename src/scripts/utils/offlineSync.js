import { initDB, getAllStories, updateStory } from '../database.js';

class OfflineSync {
  constructor() {
    this.syncInProgress = false;
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  async handleOnline() {
    console.log('Connection restored. Starting sync...');
    await this.syncOfflineData();
  }

  handleOffline() {
    console.log('Connection lost. Some features may be limited.');
  }

  async syncOfflineData() {
    if (this.syncInProgress) {
      console.log('Sync already in progress...');
      return;
    }

    this.syncInProgress = true;
    try {
      const db = await initDB();
      const stories = await getAllStories();
      let syncCount = 0;

      for (const story of stories) {
        if (story.offline) {
          try {
            const response = await fetch('/api/stories', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(story)
            });

            if (response.ok) {
              // Remove offline flag
              story.offline = false;
              await updateStory(story);
              syncCount++;
            } else {
              console.error('Failed to sync story:', story.id);
            }
          } catch (error) {
            console.error('Error syncing story:', error);
          }
        }
      }

      console.log(`Sync completed. ${syncCount} stories synchronized.`);
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  async markStoryAsOffline(story) {
    try {
      story.offline = true;
      await updateStory(story);
      console.log('Story marked as offline:', story.id);
    } catch (error) {
      console.error('Error marking story as offline:', error);
    }
  }
}

export default new OfflineSync(); 