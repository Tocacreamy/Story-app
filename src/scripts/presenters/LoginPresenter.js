class LoginPresenter {
  constructor(view, userModel, router) {
    this.view = view;
    this.userModel = userModel;
    this.router = router;

    this.init();
  }

  init() {
    this.view.setupPasswordToggle();
    this.view.bindLoginSubmit(this.handleLoginSubmit.bind(this));
  }

  async handleLoginSubmit() {
    const email = this.view.getEmail();
    const password = this.view.getPassword();

    // Basic validation
    if (!email || !password) {
      this.view.showMessage("Please fill in all fields", "error");
      return;
    }

    try {
      this.view.showLoading();

      await this.userModel.login(email, password);
      this.view.showMessage("Login successful!", "success");

      // Use router instead of direct window access
      setTimeout(() => {
        this.router.navigateTo("/");
      }, 1500);
    } catch (error) {
      this.view.showMessage(error.message || "Login failed", "error");
    } finally {
      this.view.hideLoading();
    }
  }
}

export default LoginPresenter;
