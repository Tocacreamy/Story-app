class LoginView {
  getTemplate() {
    return `
      <section class="container login-container">
        <h1>Login to Your Account</h1>
        <main id="main-content" tabindex="-1">
          <div class="login-card">
            <form id="login-form">
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" required>
              </div>
              
              <div class="form-group">
                <label for="password">Password</label>
                <div class="password-input-container">
                  <input type="password" id="password" name="password" placeholder="Enter your password" required>
                  <button type="button" id="toggle-password" class="toggle-password" aria-label="Show password">
                    <img src="images/visible.svg" alt="show password icon">
                  </button>
                </div>
              </div>
              
              <div class="form-group">
                <button type="submit" class="login-button">Login</button>
              </div>
              
              <div id="message" class="message" role="alert" aria-live="assertive"></div>
            </form>
            
            <div class="register-link">
              <p>Don't have an account? <a href="#/register">Register here</a></p>
            </div>
          </div>
        </main>
      </section>
    `;
  }

  getEmail() {
    return document.getElementById("email").value.trim();
  }

  getPassword() {
    return document.getElementById("password").value;
  }

  showLoading() {
    const loginButton = document.querySelector(".login-button");
    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";
  }

  hideLoading() {
    const loginButton = document.querySelector(".login-button");
    loginButton.disabled = false;
    loginButton.textContent = "Login";
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
        togglePasswordButton.innerHTML = `<img src="images/visible_off.svg" alt="hide password icon">`;
        togglePasswordButton.setAttribute("aria-label", "Hide password");
      } else {
        passwordInput.type = "password";
        togglePasswordButton.innerHTML = `<img src="images/visible.svg" alt="show password icon">`;
        togglePasswordButton.setAttribute("aria-label", "Show password");
      }
    });
  }

  bindLoginSubmit(handler) {
    const form = document.getElementById("login-form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      handler();
    });
  }
}

export default LoginView;
