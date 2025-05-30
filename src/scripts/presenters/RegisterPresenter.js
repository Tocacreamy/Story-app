class RegisterPresenter {
  constructor(view, userModel, router) {
    this.view = view;
    this.userModel = userModel;
    this.router = router;

    this.init();
  }

  init() {
    this.view.setupPasswordToggle();
    this.view.bindRegisterSubmit(this.handleRegisterSubmit.bind(this));
  }

  async handleRegisterSubmit() {
    const name = this.view.getName();
    const email = this.view.getEmail();
    const password = this.view.getPassword();

    // Basic validation
    if (!name.trim()) {
      this.view.showMessage("Name is required", "error");
      return;
    }

    if (!email.trim()) {
      this.view.showMessage("Email is required", "error");
      return;
    }

    if (!password) {
      this.view.showMessage("Password is required", "error");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.view.showMessage("Please enter a valid email address", "error");
      return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      this.view.showMessage(
        "Password must be at least 8 characters and include uppercase, lowercase, and numbers",
        "error"
      );
      return;
    }

    try {
      this.view.showLoading();

      // Register the user using the model
      await this.userModel.register(name, email, password);

      this.view.showMessage(
        "Registration successful! Redirecting to login...",
        "success"
      );

      // Navigate to login page after successful registration
      setTimeout(() => {
        this.router.navigateTo("/login");
      }, 1500);
    } catch (error) {
      this.view.showMessage(
        error.message || "Registration failed. Please try again.",
        "error"
      );
    } finally {
      this.view.hideLoading();
    }
  }
}

export default RegisterPresenter;
