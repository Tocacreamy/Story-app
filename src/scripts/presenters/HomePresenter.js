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

      try {
        const stories = await this.model.getStories();
        this.view.displayStories(stories);
        // Save stories to IndexedDB for offline use

        await saveStories(stories);
        console.log("Stories saved to IndexedDB");
      } catch (error) {
        if (!navigator.onLine) {
          // Try to load cached stories from IndexedDB
          const cachedStories = await getCachedStories();
          if (cachedStories && cachedStories.length > 0) {
            this.view.displayStories(cachedStories);
            this.view.showErrorMessage("You are offline. Showing cached stories.");
          } else {
            this.view.showErrorMessage("You are offline. Stories cannot be loaded right now.");
          }
        } else {
          this.view.showErrorMessage("Error: Failed to fetch stories: " + error.message);
        }
      }
    } else {
      this.view.showLoginMessage();
    }
  }
}

export default HomePresenter;
