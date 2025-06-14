import { saveStories, getCachedStories, deleteStory } from '../database.js';

class HomePresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  async init() {
    if (this.model.isUserLoggedIn()) {
      const userName = this.model.getUserName();
      this.view.showAuthenticatedUser(userName);
      this.view.bindLogoutButton(() => {
        this.model.logout();
        this.view.navigateToLogin();
      });

      await this._refreshStories();
      this._setupStoryDeletion();
    } else {
      this.view.showLoginMessage();
    }
  }

  async _refreshStories() {
    if (!navigator.onLine) {
      // If offline, try to load cached stories directly
      const cachedStories = await getCachedStories();
      if (cachedStories && cachedStories.length > 0) {
        this.view.displayStories(cachedStories);
        this.view.showErrorMessage("You are offline. Showing cached stories.");
      } else {
        this.view.showErrorMessage("You are offline. Stories cannot be loaded right now.");
      }
    } else {
      // If online, try to fetch from network first, then fallback to cache
      try {
        const stories = await this.model.getStories();
        this.view.displayStories(stories);
        await saveStories(stories);
        console.log("Stories saved to IndexedDB");
      } catch (error) {
        console.warn("Failed to fetch stories from network, attempting to load from cache:", error);
        const cachedStories = await getCachedStories();
        if (cachedStories && cachedStories.length > 0) {
          this.view.displayStories(cachedStories);
          this.view.showErrorMessage("Error: Failed to fetch stories from network. Showing cached stories.");
        } else {
          this.view.showErrorMessage("Error: Failed to fetch stories and no cached stories available: " + error.message);
        }
      }
    }
  }

  _setupStoryDeletion() {
    const storiesContainer = document.getElementById("stories-container");
    if (storiesContainer) {
      storiesContainer.addEventListener("click", async (event) => {
        if (event.target.classList.contains("delete-story-btn")) {
          const storyId = event.target.dataset.id;
          if (confirm("Are you sure you want to delete this story?")) {
            try {
              await deleteStory(storyId);
              console.log(`Story with ID ${storyId} deleted.`);
              await this._refreshStories(); // Refresh the view after deletion
            } catch (error) {
              console.error("Error deleting story:", error);
              this.view.showErrorMessage("Error: Failed to delete story: " + error.message);
            }
          }
        }
      });
    }
  }
}

export default HomePresenter;
