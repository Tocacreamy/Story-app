import { saveStories, getCachedStories } from '../database.js';

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
}

export default HomePresenter;
