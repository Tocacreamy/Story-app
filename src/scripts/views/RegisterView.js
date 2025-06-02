class RegisterView {
  getTemplate() {
    return `
      <section class="container register-container">
        <h1>Create an Account</h1>
        <div class="register-card">
          <form id="register-form">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input type="text" id="name" name="name" placeholder="Enter your full name" required>
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Enter your email address" required>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <div class="password-input-container">
                <input type="password" id="password" name="password" placeholder="Create a password" required minlength="8">
                <button type="button" id="toggle-password" class="toggle-password" aria-label="Show password">
                  <img src="public/images/visible.svg" alt="show password icon">
                </button>
              </div>
              <small class="password-requirements">Minimum 8 characters with uppercase, lowercase, and numbers</small>
            </div>
            
            <div class="form-group">
              <button type="submit" id="register-button" class="register-button">Register</button>
            </div>
            
            <div id="message" class="message" role="alert" aria-live="assertive"></div>
          </form>
          
          <div class="login-link">
            <p>Already have an account? <a href="#/login">Login here</a></p>
          </div>
        </div>
      </section>
    `;
  }

  getName() {
    return document.getElementById("name").value.trim();
  }

  getEmail() {
    return document.getElementById("email").value.trim();
  }

  getPassword() {
    return document.getElementById("password").value;
  }

  showLoading() {
    const registerButton = document.getElementById("register-button");
    registerButton.disabled = true;
    registerButton.textContent = "Creating account...";
    registerButton.setAttribute("aria-busy", "true");
  }

  hideLoading() {
    const registerButton = document.getElementById("register-button");
    registerButton.disabled = false;
    registerButton.textContent = "Register";
    registerButton.removeAttribute("aria-busy");
  }

  showMessage(message, type) {
    const messageEl = document.getElementById("message");
    messageEl.textContent = message;
    messageEl.className = "message";
    messageEl.classList.add(type);
  }

  setupPasswordToggle() {
    const togglePasswordButton = document.getElementById("toggle-password");
    const passwordInput = document.getElementById("password");

    togglePasswordButton.addEventListener("click", () => {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePasswordButton.innerHTML = `<img src="public/images/visible_off.svg" alt="hide password icon">`;
        togglePasswordButton.setAttribute("aria-label", "Hide password");
      } else {
        passwordInput.type = "password";
        togglePasswordButton.innerHTML = `<img src="public/images/visible.svg" alt="show password icon">`;
        togglePasswordButton.setAttribute("aria-label", "Show password");
      }
    });
  }

  bindRegisterSubmit(handler) {
    const form = document.getElementById("register-form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      handler();
    });
  }
}

export default RegisterView;
