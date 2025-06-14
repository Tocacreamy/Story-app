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
      } catch (error) {
        if (!navigator.onLine) {
          this.view.showErrorMessage("You are offline. Stories cannot be loaded right now.");
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
