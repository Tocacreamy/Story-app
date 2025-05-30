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
        window.location.hash = "#/login";
      });

      try {
        const stories = await this.model.getStories();
        this.view.displayStories(stories);
      } catch (error) {
        this.view.showErrorMessage(error.message);
      }
    } else {
      this.view.showLoginMessage();
    }
  }
}

export default HomePresenter;
