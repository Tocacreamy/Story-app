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

      let storiesToDisplay = [];

      if (!navigator.onLine) {
        // If offline, first try to get from cache immediately
        const cachedStories = await getCachedStories();
        if (cachedStories && cachedStories.length > 0) {
          storiesToDisplay = cachedStories;
          this.view.displayStories(storiesToDisplay);
          this.view.showErrorMessage("You are offline. Showing cached stories.");
          console.log('Cached stories attempted to display:', cachedStories);
        } else {
          this.view.showErrorMessage("You are offline. No cached stories available.");
        }
      }

      // Always attempt to fetch from network (or update cache) when online or to get fresh data
      try {
        const networkStories = await this.model.getStories();
        if (networkStories) {
          storiesToDisplay = networkStories;
          this.view.displayStories(storiesToDisplay); // Display fresh data
          await saveStories(networkStories); // Update cache with fresh data
          console.log("Stories fetched and updated in IndexedDB");
        }
      } catch (error) {
        // If we are truly online and network fetch fails, show the error
        // If offline, and we already showed cached stories, no need for another error.
        if (navigator.onLine || (storiesToDisplay && storiesToDisplay.length === 0)) {
          this.view.showErrorMessage("Error: Failed to fetch stories: " + error.message);
        }
        console.error("Error loading stories (network/cache fallback):");
      }
    } else {
      this.view.showLoginMessage();
    }
  }
}

export default HomePresenter;
